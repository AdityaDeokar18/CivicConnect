package com.civicconnect.dto;

import jakarta.validation.constraints.NotBlank;

public class ResolveComplaintRequest {

    @NotBlank(message = "Resolution proof photo/document is mandatory to mark complaint as RESOLVED")
    private String proofUrl;

    @NotBlank(message = "Resolution notes explaining actions taken are mandatory")
    private String remarks;

    public ResolveComplaintRequest() {}

    public ResolveComplaintRequest(String proofUrl, String remarks) {
        this.proofUrl = proofUrl;
        this.remarks = remarks;
    }

    public String getProofUrl() {
        return proofUrl;
    }

    public void setProofUrl(String proofUrl) {
        this.proofUrl = proofUrl;
    }

    public String getRemarks() {
        return remarks;
    }

    public void setRemarks(String remarks) {
        this.remarks = remarks;
    }
}
