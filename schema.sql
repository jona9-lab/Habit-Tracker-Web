CREATE TABLE habits (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    frequency ENUM('Daily', 'Weekly', 'Monthly') NOT NULL,
    streak INT DEFAULT 0,
    last_completed DATE,
    goal_days INT
);
