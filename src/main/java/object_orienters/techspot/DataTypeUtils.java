package object_orienters.techspot;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.zip.DataFormatException;
import java.util.zip.Deflater;
import java.util.zip.GZIPInputStream;
import java.util.zip.GZIPOutputStream;
import java.util.zip.Inflater;
import java.util.zip.ZipException;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class DataTypeUtils {
    private static Logger logger = LoggerFactory.getLogger(DataTypeUtils.class);

    public static byte[] compress(byte[] data) {
        try (ByteArrayOutputStream bos = new ByteArrayOutputStream();
                GZIPOutputStream gzip = new GZIPOutputStream(bos)) {
            gzip.write(data);
            gzip.finish();
            return bos.toByteArray();
        } catch (IOException e) {
            // Log error, throw a custom exception, or handle it based on your application
            // needs
            throw new RuntimeException("Compression error", e);
        }
    }

    private static final int GZIP_MAGIC_FIRST_BYTE = 0x1f;
    private static final int GZIP_MAGIC_SECOND_BYTE = 0x8b;

    public static byte[] safelyDecompress(byte[] data) {
        if (isGzipCompressed(data)) {
            return decompress(data);
        } else {
            // Return the data as is, assuming it's either uncompressed or in a format we're
            // not handling
            return data;
        }
    }

    private static boolean isGzipCompressed(byte[] data) {

        if (data == null || data.length < 2) {
            return false;
        }
        return (data[0] == GZIP_MAGIC_FIRST_BYTE) && (data[1] == (byte) GZIP_MAGIC_SECOND_BYTE);
    }

    private static byte[] decompress(byte[] compressedData) {
        
        try (ByteArrayInputStream bis = new ByteArrayInputStream(compressedData);
                GZIPInputStream gzip = new GZIPInputStream(bis);
                ByteArrayOutputStream bos = new ByteArrayOutputStream()) {
            byte[] buffer = new byte[4096];
            int len;
            while ((len = gzip.read(buffer)) != -1) {
                bos.write(buffer, 0, len);
            }
            logger.info("safely decomposed");
            return bos.toByteArray();
        } catch (IOException e) {
            // Log error, throw a custom exception, or handle it based on your application
            // needs
            throw new RuntimeException("Decompression error", e);
        }
    }

}