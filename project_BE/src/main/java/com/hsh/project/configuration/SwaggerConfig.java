package com.hsh.project.configuration;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SwaggerConfig {

    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
                .info(new Info().title("TOIREVIEW - REVIEW MỌI THỨ"))
                .addSecurityItem(new SecurityRequirement().addList("Xác thực TOIREVIEW"))
                .components(new Components().addSecuritySchemes("Xác thực TOIREVIEW", new SecurityScheme()
                        .name("TOIREVIEW - REVIEW MỌI THỨ").type(SecurityScheme.Type.HTTP).scheme("bearer").bearerFormat("JWT")));
    }
}