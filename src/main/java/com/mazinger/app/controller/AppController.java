package com.mazinger.app.controller;

import java.util.Collections;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.mazinger.web.ServiceResponseDTO;

@RestController
@RequestMapping("/service")
public class AppController {

    @PostMapping("/app/usergroup/get")
    public Object getUsergroup() {
        return ServiceResponseDTO.succeed(Collections.emptyList());
    }

    @PostMapping("/app/locations")
    public Object getLocations() {
        return ServiceResponseDTO.succeed(Collections.emptyList());
    }

    @PostMapping("/app/bu")
    public Object getBU() {
        return ServiceResponseDTO.succeed(Collections.emptyList());
    }

    @PostMapping("/app/bg")
    public Object getBG() {
        return ServiceResponseDTO.succeed(Collections.emptyList());
    }
}
