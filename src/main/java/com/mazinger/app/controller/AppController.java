package com.mazinger.app.controller;

import java.util.Collections;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.mazinger.app.model.dto.ResponseVO;

@RestController
@RequestMapping("/service")
public class AppController {

    @PostMapping("/app/usergroup/get")
    public Object getUsergroup() {
        return ResponseVO.succeed(Collections.emptyList());
    }

    @PostMapping("/app/locations")
    public Object getLocations() {
        return ResponseVO.succeed(Collections.emptyList());
    }

    @PostMapping("/app/bu")
    public Object getBU() {
        return ResponseVO.succeed(Collections.emptyList());
    }

    @PostMapping("/app/bg")
    public Object getBG() {
        return ResponseVO.succeed(Collections.emptyList());
    }
}
