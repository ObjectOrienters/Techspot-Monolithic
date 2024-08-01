package object_orienters.techspot;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class CloudinaryConfig {

    @Bean
    public Cloudinary cloudinary() {
        return new Cloudinary(ObjectUtils.asMap(
                "cloud_name", "dtm407obh",
                "api_key", "114988234738287",
                "api_secret", "L7c1WbG_LwwH1laQZ787ISe_muo"));
    }
}
