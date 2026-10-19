package com.civicconnect.bootstrap;

import com.civicconnect.model.Department;
import com.civicconnect.repository.DepartmentRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.List;

@Component
@Order(2)
public class DepartmentDataInitializer implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(DepartmentDataInitializer.class);

    private final DepartmentRepository departmentRepository;

    public DepartmentDataInitializer(DepartmentRepository departmentRepository) {
        this.departmentRepository = departmentRepository;
    }

    @Override
    public void run(String... args) {
        if (departmentRepository.count() > 0) {
            logger.info("Municipal departments already configured in database. Skipping initialization.");
            return;
        }

        logger.info("Initializing standard municipal departments configuration...");

        Department dept1 = new Department(
                "Road Maintenance & Potholes",
                "PWD_ROAD",
                "Responsible for asphalt repair, potholes, road widening, and footpaths.",
                "Vikram Singh",
                "roads@civicconnect.gov.in",
                48
        );
        dept1.setCategories(Arrays.asList("Pothole Hazard", "Broken Road Divider", "Damaged Footpath", "Illegal Road Speedbump"));

        Department dept2 = new Department(
                "Solid Waste Management",
                "SWM_CLEAN",
                "Garbage collection, overflowing dumpsters, and public sanitization.",
                "Sunita Deshmukh",
                "waste@civicconnect.gov.in",
                24
        );
        dept2.setCategories(Arrays.asList("Overflowing Garbage Bin", "Illegal Debris Dumping", "Dead Animal Removal", "Unswept Street"));

        Department dept3 = new Department(
                "Water Supply & Drainage",
                "WSD_WATER",
                "Drinking water pipeline leakages, low pressure, open storm drains, sewage overflow.",
                "Ramesh Kulkarni",
                "water@civicconnect.gov.in",
                36
        );
        dept3.setCategories(Arrays.asList("Main Water Pipe Burst", "Sewage Overflow", "Contaminated Water", "Missing Manhole Cover"));

        Department dept4 = new Department(
                "Electrical & Street Lighting",
                "ELEC_LIGHT",
                "Defunct street lamps, hanging high-voltage wires, damaged electric meters.",
                "Anil Shinde",
                "electrical@civicconnect.gov.in",
                24
        );
        dept4.setCategories(Arrays.asList("Defunct Street Light", "Exposed Wire Hazard", "Flickering Light", "Pole Collision Damage"));

        Department dept5 = new Department(
                "Parks & Urban Greenery",
                "PARK_GREEN",
                "Overgrown trees blocking roads, damaged public park equipment.",
                "Kavita Rao",
                "parks@civicconnect.gov.in",
                72
        );
        dept5.setCategories(Arrays.asList("Fallen Tree Branch", "Damaged Playground Equipment", "Unmaintained Public Park"));

        departmentRepository.saveAll(List.of(dept1, dept2, dept3, dept4, dept5));
        logger.info("Standard municipal departments successfully initialized.");
    }
}
