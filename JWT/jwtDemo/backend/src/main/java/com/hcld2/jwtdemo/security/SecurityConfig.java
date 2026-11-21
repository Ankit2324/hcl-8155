
package com.hcld2.jwtdemo.security;

import jakarta.servlet.http.HttpServletResponse;
import lombok.AllArgsConstructor;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableWebSecurity
@AllArgsConstructor
public class SecurityConfig {

    private final JwtAuthFilter jwtAuthFilter;

    @Bean
    public SecurityFilterChain securitySecurityFilterChain(
            HttpSecurity http) throws Exception {

        http
                .csrf(csrf -> csrf.disable())

                .cors(Customizer.withDefaults())

                .sessionManagement(session ->
                        session.sessionCreationPolicy(
                                SessionCreationPolicy.STATELESS
                        )
                )

                .headers(headers ->
                        headers.frameOptions(frame ->
                                frame.sameOrigin()
                        )
                )

                .authorizeHttpRequests(auth -> auth

                        // Allow public endpoints
                        .requestMatchers(
                                "/api/v1/auth/**",
                                "/h2-console/**",
                                "/error",
                                "/swagger-ui/**",
                                "/v3/api-docs/**"
                        ).permitAll()

                        // Allow GET requests for posts
                        .requestMatchers(
                                HttpMethod.GET,
                                "/api/v1/posts/**"
                        ).permitAll()

                        // POST requests require JWT authentication
                        .requestMatchers(
                                HttpMethod.POST,
                                "/api/v1/posts/**"
                        ).authenticated()

                        // All other requests require authentication
                        .anyRequest().authenticated()
                )

                .exceptionHandling(exception ->
                        exception.authenticationEntryPoint(
                                (request, response, ex) ->
                                        response.sendError(
                                                HttpServletResponse.SC_UNAUTHORIZED,
                                                "Unauthorized"
                                        )
                        )
                )

                .addFilterBefore(
                        jwtAuthFilter,
                        UsernamePasswordAuthenticationFilter.class
                );

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    // CORS Configuration
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {

        CorsConfiguration cfg = new CorsConfiguration();

        // Allow React frontend
        cfg.setAllowedOrigins(
                List.of("http://localhost:5173")
        );

        // Allow HTTP methods
        cfg.setAllowedMethods(
                List.of("GET", "POST", "PUT", "DELETE", "OPTIONS")
        );

        // Allow request headers
        cfg.setAllowedHeaders(
                List.of("*")
        );

        cfg.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource src =
                new UrlBasedCorsConfigurationSource();

        src.registerCorsConfiguration("/**", cfg);

        return src;
    }
}
