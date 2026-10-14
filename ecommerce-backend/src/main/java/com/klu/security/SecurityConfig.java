package com.klu.security;

import java.util.List;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    public SecurityConfig(JwtAuthenticationFilter jwtAuthenticationFilter) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        http
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .csrf(csrf -> csrf.disable())
            .authorizeHttpRequests(auth -> auth

                // CORS Preflight
                .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()

                // Razorpay Webhook (called by Razorpay servers, no JWT)
                .requestMatchers("/api/payment/webhook").permitAll()

                // WebSocket handshake (browser cannot send JWT header here)
                .requestMatchers("/ws-smartcart/**").permitAll()

                // Signup and Signin
                .requestMatchers("/api/auth/**").permitAll()

                // Product View
                .requestMatchers(HttpMethod.GET, "/api/products/**").permitAll()

                // Product Insert
                .requestMatchers(HttpMethod.POST, "/api/products/**").hasRole("ADMIN")

                // Product Update
                .requestMatchers(HttpMethod.PUT, "/api/products/**").hasRole("ADMIN")

                // Product Delete
                .requestMatchers(HttpMethod.DELETE, "/api/products/**").hasRole("ADMIN")

                // CO5: Background job status (Admin only)
                .requestMatchers("/api/jobs/**").hasRole("ADMIN")

                .anyRequest().authenticated()
            )
            .sessionManagement(session ->
                session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            )
            .addFilterBefore(
                jwtAuthenticationFilter,
                UsernamePasswordAuthenticationFilter.class
            );

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {

        CorsConfiguration configuration = new CorsConfiguration();

        configuration.setAllowedOrigins(
            List.of(
                "http://localhost:5173",
                "https://smartcart-ecommerce-mu.vercel.app"
            )
        );

        configuration.setAllowedMethods(
            List.of("GET", "POST", "PUT", "DELETE", "OPTIONS")
        );

        configuration.setAllowedHeaders(
            List.of("*")
        );

        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source =
            new UrlBasedCorsConfigurationSource();

        source.registerCorsConfiguration("/**", configuration);

        return source;
    }
}