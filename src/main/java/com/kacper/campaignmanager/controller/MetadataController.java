package com.kacper.campaignmanager.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api")
public class MetadataController {

    @GetMapping("/keywords")
    public List<String> getKeywords() {
        return List.of("marketing", "advertising", "digital", "social media",
                "SEO", "PPC", "content marketing", "email marketing");
    }

    @GetMapping("/towns")
    public List<String> getTowns() {
        return List.of("WARSAW","KRAKOW","GDANSK","WROCLAW","POZNAN");
    }
}
