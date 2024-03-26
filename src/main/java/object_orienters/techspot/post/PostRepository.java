package object_orienters.techspot.post;

import object_orienters.techspot.profile.Profile;
import org.springframework.data.jpa.repository.JpaRepository;


import java.util.Collection;

public interface PostRepository extends JpaRepository<Post, Long> {
    Collection<Post> findByAuthor(Profile user);

   // Collection<Post> findBySharer(Profile user); //TODO: add shared post implementation so that the user can see the shared posts
}
