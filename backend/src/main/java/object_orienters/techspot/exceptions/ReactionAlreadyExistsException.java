package object_orienters.techspot.exceptions;

public class ReactionAlreadyExistsException extends RuntimeException {
    public ReactionAlreadyExistsException(String user) {
        super("User " + user + " has already reacted to this content");
    }
}
