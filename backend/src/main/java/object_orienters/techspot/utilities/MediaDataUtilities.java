package object_orienters.techspot.utilities;

import object_orienters.techspot.content.ReactableContent;
import object_orienters.techspot.postTypes.DataType;
import object_orienters.techspot.postTypes.DataTypeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Service
public class MediaDataUtilities {

    private final FileStorageService fileStorageService;
    private final DataTypeRepository dataTypeRepository;

    @Autowired
    public MediaDataUtilities(FileStorageService fileStorageService, DataTypeRepository dataTypeRepository) {
        this.fileStorageService = fileStorageService;
        this.dataTypeRepository = dataTypeRepository;
    }

    public DataType handleAddFile(MultipartFile file) {
        DataType pic = new DataType();
        String fileUrl = fileStorageService.storeFile(file);
        pic.setType(file.getContentType());
        pic.setFileName(file.getOriginalFilename());
        pic.setFileUrl(fileUrl);
        return pic;
    }

    public void handleAddMediaData(List<MultipartFile> files, List<DataType> allMedia) {
        files.stream().forEach((file) -> {
            DataType media = new DataType();
            String fileUrl = fileStorageService.storeFile(file);
            media.setType(file.getContentType());
            media.setFileName(file.getOriginalFilename());
            media.setFileUrl(fileUrl);
            allMedia.add(media);
        });
    }

    public void handleDeleteMediaData(ReactableContent post) {
        post.getMediaData().forEach(media -> {
            fileStorageService.deleteFile(media.getFileUrl());
            dataTypeRepository.delete(media);
        });
    }
}

