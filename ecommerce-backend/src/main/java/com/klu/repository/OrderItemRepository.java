package com.klu.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.klu.model.OrderItem;

public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {
}