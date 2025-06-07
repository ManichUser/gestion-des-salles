package com.roomwise.planning.service.external;

import com.roomwise.planning.dto.RoomDto;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "room-service", url = "http://localhost:8081/api/rooms")
public interface RoomClient {
    @GetMapping("/{id}")
    RoomDto getRoomById(@PathVariable Long id);
}
