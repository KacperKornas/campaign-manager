package com.kacper.campaignmanager.model;

import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.validation.constraints.*;
import lombok.Data;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Entity
@Data
public class Campaign {

    @Id
    @GeneratedValue
    private Long id;

    @NotBlank
    private String name;

    @NotNull
    @ElementCollection
    @Size(min = 1)
    private List<@NotBlank String> keywords = new ArrayList<>();

    @NotNull
    @DecimalMin("0.0")
    private BigDecimal bidAmount;

    @NotNull
    @DecimalMin("0.0")
    private BigDecimal campaignFund;

    @NotNull
    private Boolean status;

    private String town;

    @NotNull
    @Min(0)
    private Integer radiusKm;
}
