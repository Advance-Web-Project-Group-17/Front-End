import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "./GroupListPage.module.css";

const GroupListPage = () => {
  const baseUrl = useMemo(() => process.env.REACT_APP_BASE_URL, []);
  const [groups, setGroups] = useState([]);
  const [groupName, setGroupName] = useState("");
  const user_id = sessionStorage.getItem("id")
  const navigate = useNavigate()

  const handleGroupClick = (group_id) => {
    navigate(`/group/${group_id}`);
  };

  useEffect(() => {
    // Fetch existing groups
    const fetchGroups = async () => {
      try {
        const response = await axios.get(`${baseUrl}/group/getGroup`);
        console.log("group:" + response.data);
        setGroups(response.data); // Assuming response contains groups
      } catch (error) {
        console.error("Error fetching groups:", error);
      }
    };
  
    fetchGroups();
  }, [baseUrl]); // Add baseUrl to the dependency array
  

  const handleCreateGroup = async (e) => {
    e.preventDefault();
  
    if (!groupName.trim()) {
      alert("Group name cannot be empty!");
      return;
    }
  
    try {
      // Send group_name and user_id directly, no need for the "data" object
      const response = await axios.post(`${baseUrl}/group/create`, {
        group_name: groupName, 
        user_id, // User ID is being sent as part of the request body
      });
  
      if (response.status === 200) {
        setGroups((prevGroups) => [...prevGroups, response.data.response]);
        setGroupName(""); // Reset group name input after successful creation
        alert("Group created successfully!");
      }
    } catch (error) {
      console.error("Error creating group:", error);
      alert("Failed to create group.");
    }
  };
  

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Groups</h1>
      <div className={styles.groupsContainer}>
        {groups.map((group) => (
          <div key={group.group_id} className={styles.groupCard}>
            <h2 className={styles.groupName} onClick={() => {handleGroupClick(group.group_id)}}>{group.group_name}</h2>
          </div>
        ))}
      </div>

      <div className={styles.createGroupForm}>
        <h2>Create a New Group</h2>
        <form onSubmit={handleCreateGroup}>
          <input
            type="text"
            placeholder="Group Name"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            className={styles.input}
          />
          <button type="submit" className={styles.createButton}>
            Create Group
          </button>
        </form>
      </div>
    </div>
  );
};

export default GroupListPage;
