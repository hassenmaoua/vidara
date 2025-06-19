package edu.esprit.content.utils;

import edu.esprit.content.entity.Content;
import edu.esprit.content.enumeration.AccessLevel;
import edu.esprit.content.enumeration.ContentType;
import org.springframework.data.jpa.domain.Specification;

import java.util.List;

public class ContentSpecifications {
    private ContentSpecifications() {
    }

    public static Specification<Content> hasCreatorIds(List<Long> creatorIds) {
        return (root, query, cb) -> root.get("creatorId").in(creatorIds);
    }

    public static Specification<Content> hasCreatorId(Long creatorId) {
        return creatorId == null
                ? Specification.where(null)
                : (root, query, cb) -> cb.equal(root.get("creatorId"), creatorId);
    }

    public static Specification<Content> hasAccessLevel(AccessLevel accessLevel) {
        return accessLevel == null
                ? Specification.where(null)
                : (root, query, cb) -> cb.equal(root.get("accessLevel"), accessLevel);
    }

    public static Specification<Content> hasType(ContentType contentType) {
        return contentType == null
                ? Specification.where(null)
                : (root, query, cb) -> cb.equal(root.get("contentType"), contentType);
    }

    public static Specification<Content> isActive(boolean onlyActive) {
        return Boolean.TRUE.equals(onlyActive)
                ? (root, query, cb) -> cb.isTrue(root.get("active"))
                : Specification.where(null);
    }
}
