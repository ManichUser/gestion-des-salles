package com.roomwise.planning.service.external;


import com.roomwise.planning.dto.UserDto;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;

@FeignClient(name = "auth-service", url = "http://localhost:8083/api/auth")
public interface AuthClient {

    @GetMapping("/me")
    UserDto getCurrentUser(@RequestHeader("Authorization") String token);
}
