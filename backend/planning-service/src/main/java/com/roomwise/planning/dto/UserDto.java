package com.roomwise.planning.dto;

import com.roomwise.planning.model.Role;
import com.roomwise.planning.model.Status;
import lombok.Data;

@Data
public class UserDto {


    private Long id;
    private String email;
    private String username;
    private Role role;
    private String filiere;
    private String niveau;
    private Status status;
}
