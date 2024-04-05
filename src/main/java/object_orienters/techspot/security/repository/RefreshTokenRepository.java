package object_orienters.techspot.security.repository;

import object_orienters.techspot.security.model.RefreshToken;
import object_orienters.techspot.security.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import javax.swing.text.html.Option;
import java.util.Optional;

public interface RefreshTokenRepository extends JpaRepository<RefreshToken, Long> {
    Optional<RefreshToken> findByToken(String token);

    Optional<RefreshToken> findByUser(User user);
    int deleteByUser(User user);
}
