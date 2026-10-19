package com.civicconnect.dto;

import java.util.List;
import java.util.Map;

public class AdminAnalyticsDto {

    private long total;
    private long pending;
    private long assigned;
    private long inProgress;
    private long resolved;
    private long closed;
    private long completedTotal;
    private int slaComplianceRate;
    private long totalCitizens;
    private long totalOfficers;
    private long pendingOfficers;

    private List<Map<String, Object>> categoryData;
    private List<Map<String, Object>> statusData;
    private List<Map<String, Object>> deptPerformance;

    public AdminAnalyticsDto() {}

    public long getTotal() {
        return total;
    }

    public void setTotal(long total) {
        this.total = total;
    }

    public long getPending() {
        return pending;
    }

    public void setPending(long pending) {
        this.pending = pending;
    }

    public long getAssigned() {
        return assigned;
    }

    public void setAssigned(long assigned) {
        this.assigned = assigned;
    }

    public long getInProgress() {
        return inProgress;
    }

    public void setInProgress(long inProgress) {
        this.inProgress = inProgress;
    }

    public long getResolved() {
        return resolved;
    }

    public void setResolved(long resolved) {
        this.resolved = resolved;
    }

    public long getClosed() {
        return closed;
    }

    public void setClosed(long closed) {
        this.closed = closed;
    }

    public long getCompletedTotal() {
        return completedTotal;
    }

    public void setCompletedTotal(long completedTotal) {
        this.completedTotal = completedTotal;
    }

    public int getSlaComplianceRate() {
        return slaComplianceRate;
    }

    public void setSlaComplianceRate(int slaComplianceRate) {
        this.slaComplianceRate = slaComplianceRate;
    }

    public long getTotalCitizens() {
        return totalCitizens;
    }

    public void setTotalCitizens(long totalCitizens) {
        this.totalCitizens = totalCitizens;
    }

    public long getTotalOfficers() {
        return totalOfficers;
    }

    public void setTotalOfficers(long totalOfficers) {
        this.totalOfficers = totalOfficers;
    }

    public long getPendingOfficers() {
        return pendingOfficers;
    }

    public void setPendingOfficers(long pendingOfficers) {
        this.pendingOfficers = pendingOfficers;
    }

    public List<Map<String, Object>> getCategoryData() {
        return categoryData;
    }

    public void setCategoryData(List<Map<String, Object>> categoryData) {
        this.categoryData = categoryData;
    }

    public List<Map<String, Object>> getStatusData() {
        return statusData;
    }

    public void setStatusData(List<Map<String, Object>> statusData) {
        this.statusData = statusData;
    }

    public List<Map<String, Object>> getDeptPerformance() {
        return deptPerformance;
    }

    public void setDeptPerformance(List<Map<String, Object>> deptPerformance) {
        this.deptPerformance = deptPerformance;
    }
}
