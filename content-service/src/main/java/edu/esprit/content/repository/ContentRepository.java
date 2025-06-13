package edu.esprit.content.repository;

import edu.esprit.content.entity.Content;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ContentRepository extends JpaRepository<Content, Long>, JpaSpecificationExecutor<Content> {
    Page<Content> findByCreatorIdIn(List<Long> creatorIds, Pageable pageable);
    List<Content> findByCreatorId(Long creatorId);
}
