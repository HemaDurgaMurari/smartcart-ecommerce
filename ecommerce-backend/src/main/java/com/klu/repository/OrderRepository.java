package com.klu.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.klu.model.Order;

public interface OrderRepository extends JpaRepository<Order, Long> {
}