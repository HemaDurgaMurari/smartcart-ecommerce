package com.klu.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.klu.model.BackgroundJob;

public interface BackgroundJobRepository
        extends JpaRepository<BackgroundJob, Long> {
}