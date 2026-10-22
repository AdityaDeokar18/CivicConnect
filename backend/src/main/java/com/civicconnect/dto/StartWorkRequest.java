package com.civicconnect.dto;

import jakarta.validation.constraints.NotBlank;

public class StartWorkRequest {

    @NotBlank(message = "Inspection/work proof is mandatory before moving complaint to IN_PROGRESS")
    private String proofUrl;

    private String remarks;

    public StartWorkRequest() {}

    public StartWorkRequest(String proofUrl, String remarks) {
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

    public void setWorkProofUrl(String workProofUrl) {
        if (this.proofUrl == null || this.proofUrl.isBlank()) {
            this.proofUrl = workProofUrl;
        }
    }

    public void setProof(String proof) {
        if (this.proofUrl == null || this.proofUrl.isBlank()) {
            this.proofUrl = proof;
        }
    }

    public void setWorkNotes(String workNotes) {
        if (this.remarks == null || this.remarks.isBlank()) {
            this.remarks = workNotes;
        }
    }

    public void setNotes(String notes) {
        if (this.remarks == null || this.remarks.isBlank()) {
            this.remarks = notes;
        }
    }

}
