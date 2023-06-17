package com.mazinger.app.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class PageController {

    @GetMapping("/")
    public String index() {
        return "redirect:/importer";
    }

    @GetMapping("/builder")
    public String builder() {
        return "formBuilder";
    }

    @GetMapping("/importer")
    public String formImporter() {
        return "index";
    }
}
