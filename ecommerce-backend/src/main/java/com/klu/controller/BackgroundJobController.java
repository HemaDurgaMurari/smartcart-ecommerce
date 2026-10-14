package com.klu.controller;

import java.util.List;

import org.springframework.web.bind.annotation.*;

import com.klu.model.BackgroundJob;
import com.klu.repository.BackgroundJobRepository;

@RestController
@RequestMapping("/api/jobs")
@CrossOrigin(origins = "http://localhost:5173")
public class BackgroundJobController {

    private final BackgroundJobRepository repository;

    public BackgroundJobController(BackgroundJobRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public List<BackgroundJob> getAllJobs() {
        return repository.findAll();
    }
}