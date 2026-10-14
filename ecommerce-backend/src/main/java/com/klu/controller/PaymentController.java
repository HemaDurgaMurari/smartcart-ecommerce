package com.klu.controller;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.klu.dto.PaymentVerifyRequest;
import com.klu.service.PaymentService;

@RestController
@RequestMapping("/api/payment")
@CrossOrigin(origins = "http://localhost:5173")
public class PaymentController {

    private final PaymentService paymentService;

    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    @PostMapping("/create/{orderId}")
    public ResponseEntity<?> createPayment(@PathVariable Long orderId) {
        try {
            return ResponseEntity.ok(paymentService.createRazorpayOrder(orderId));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", String.valueOf(e.getMessage())));
        }
    }

    @PostMapping("/verify")
    public ResponseEntity<?> verifyPayment(@RequestBody PaymentVerifyRequest request) {
        try {
            boolean verified = paymentService.verifyPayment(request);

            if (!verified) {
                return ResponseEntity.badRequest()
                        .body(Map.of("message", "Payment verification failed"));
            }

            return ResponseEntity.ok(Map.of("message", "Payment successful"));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", String.valueOf(e.getMessage())));
        }
    }

    @PostMapping("/webhook")
    public ResponseEntity<?> webhook(
            @RequestHeader("X-Razorpay-Signature") String signature,
            @RequestBody String payload) {
        try {
            paymentService.processWebhook(payload, signature);
            return ResponseEntity.ok(Map.of("message", "Webhook processed"));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "Invalid webhook"));
        }
    }
}