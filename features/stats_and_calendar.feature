Feature: Statistics and Calendar
  As a user
  I want to view task statistics and calendar
  So that I can better track and manage my tasks

  Scenario: Check statistics and calendar functionality
    Given User is logged in and has tasks
    When User navigates to statistics section
    Then Statistical charts should be displayed correctly
    When User navigates to calendar section
    Then Calendar should be displayed with tasks