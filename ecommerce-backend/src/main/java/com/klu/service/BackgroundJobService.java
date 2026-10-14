package com.klu.service;

import org.springframework.stereotype.Service;

import com.klu.model.BackgroundJob;
import com.klu.repository.BackgroundJobRepository;

@Service
public class BackgroundJobService {

    private final BackgroundJobRepository repository;
    private final BackgroundJobProcessor processor;

    public BackgroundJobService(
            BackgroundJobRepository repository,
            BackgroundJobProcessor processor) {
        this.repository = repository;
        this.processor = processor;
    }

    public void startOrderJobs(Long orderId) {
        createAndRun(orderId, "EMAIL");
        createAndRun(orderId, "INVOICE");
        createAndRun(orderId, "NOTIFICATION");
    }

    private void createAndRun(Long orderId, String type) {
        BackgroundJob job = new BackgroundJob();
        job.setOrderId(orderId);
        job.setJobType(type);
        job.setStatus("PENDING");
        job.setMessage("Waiting for processing");

        BackgroundJob saved = repository.save(job);

        processor.process(saved.getJobId()); // sends the job for async processing
    }
}