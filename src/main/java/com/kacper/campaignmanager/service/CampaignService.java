package com.kacper.campaignmanager.service;

import com.kacper.campaignmanager.model.Campaign;
import com.kacper.campaignmanager.repository.CampaignRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CampaignService {
    private final CampaignRepository repo;

    public List<Campaign> findAll() { return repo.findAll(); }

    public Campaign findById(Long id) {
        return repo.findById(id).orElseThrow(() -> new EntityNotFoundException("Campaign not found: " + id));
    }

    public Campaign create(Campaign c) {
        return repo.save(c);
    }

    public Campaign update(Long id, Campaign c) {
        Campaign existing = findById(id);
        BeanUtils.copyProperties(c, existing, "id");
        return repo.save(existing);
    }

    public void delete(Long id) {
        repo.delete(findById(id));
    }
}
