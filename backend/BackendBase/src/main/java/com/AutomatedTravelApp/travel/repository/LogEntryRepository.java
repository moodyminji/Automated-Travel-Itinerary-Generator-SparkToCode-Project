package com.AutomatedTravelApp.travel.repository;

import com.AutomatedTravelApp.travel.model.LogEntry;
import org.springframework.data.jpa.repository.*;

import java.time.Instant;
import java.util.List;

public interface LogEntryRepository extends JpaRepository<LogEntry, Long> {

    List<LogEntry> findTop200ByOrderByCreatedAtDesc();

    @Query("""
      SELECT le.message as msg, COUNT(le) as cnt,
             MIN(le.createdAt) as firstTs, MAX(le.createdAt) as lastTs
      FROM LogEntry le
      WHERE le.level = 'ERROR'
      GROUP BY le.message
      ORDER BY cnt DESC
    """)
    List<Object[]> bucketizeErrors();

    long countByCreatedAtAfter(Instant after);

    @Query("SELECT COUNT(le) FROM LogEntry le WHERE le.level='ERROR'")
    long countErrors();
}

