Feature: Task Creation

  Scenario: Create a task and verify it appears in the dashboard
    Given I am on the login page
    When I log in with valid credentials
    And I open the task creation modal
    And I fill in the task form with valid data
    And I submit the task form
    Then I should see the task listed in the dashboard
