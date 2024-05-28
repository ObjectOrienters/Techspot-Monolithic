package object_orienters.techspot.security.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.stereotype.Service;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class OAuthDto {
    private String id;
    private String username;

    public String toString() {
        return "OAuthDto(id=" + this.getId() + ", username=" + this.getUsername() + ")";
    }
}
