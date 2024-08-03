import React, { useEffect, useState } from 'react';
import './MemberClub.css';

const MemberClub = ({ account, contract }) => {
  const [members, setMembers] = useState([]);

  // Function to save members to localStorage
  const saveMembers = (members) => {
    localStorage.setItem('members', JSON.stringify(members));
  };

  // Function to load members from localStorage or contract
  const loadMembers = async () => {
    const savedMembers = localStorage.getItem('members');
    if (savedMembers) {
      setMembers(JSON.parse(savedMembers));
    } else if (contract) {
      const addresses = await contract.methods.getAllMemberAddresses().call();
      const members = await Promise.all(addresses.map(async (address) => {
        const name = await contract.methods.getUserName(address).call();
        const rating = await contract.methods.getUserRating(address).call();
        return { id: address, name, rating: Number(rating) };
      }));
      setMembers(members);
      saveMembers(members);
    }
  };

  useEffect(() => {
    loadMembers();
  }, [contract]);

  // Function to add a new member and save to localStorage
  const addMember = async (name, rating) => {
    if (!name || isNaN(rating) || rating < 1 || rating > 5) {
      alert("Invalid member name or rating.");
      return;
    }
    await contract.methods.addMember(account, name, rating).send({ from: account });
    const newMember = { id: account, name, rating: Number(rating) };
    const updatedMembers = [...members, newMember];
    setMembers(updatedMembers);
    saveMembers(updatedMembers);
  };

  // Convert the rating string to a number
  const convertRating = (ratingString) => {
    switch (ratingString) {
      case "Classic":
        return 1;
      case "Bronze":
        return 2;
      case "Silver":
        return 3;
      case "Gold":
        return 4;
      case "Platinum":
        return 5;
      default:
        return 1;
    }
  };

  // Map the rating number to the corresponding level string
  const ratingToLevel = (rating) => {
    switch (rating) {
      case 1:
        return "Classic";
      case 2:
        return "Bronze";
      case 3:
        return "Silver";
      case 4:
        return "Gold";
      case 5:
        return "Platinum";
      default:
        return "Unknown";
    }
  };

  return (
    <div className="member-club-container">
      <div className="member-header">
        <h1>Member Club</h1>
        <p>There are 5 different member levels:</p>
      </div>
      <div className="member-levels">
        <div className="level" style={{ backgroundColor: '#e0e0e0' }}>
          <h2>Classic</h2>
          <p>Donated less than 0.5 ETH</p>
        </div>
        <div className="level" style={{ backgroundColor: '#cd7f32' }}>
          <h2>Bronze</h2>
          <p>Donated 0.5 ETH to 1 ETH</p>
        </div>
        <div className="level" style={{ backgroundColor: '#c0c0c0' }}>
          <h2>Silver</h2>
          <p>Donated 1 ETH to 5 ETH</p>
        </div>
        <div className="level" style={{ backgroundColor: '#ffd700' }}>
          <h2>Gold</h2>
          <p>Donated 5 ETH to 10 ETH</p>
        </div>
        <div className="level" style={{ backgroundColor: '#e5e4e2' }}>
          <h2>Platinum</h2>
          <p>Donated more than 10 ETH</p>
        </div>
      </div>
      <div className="member-list">
        <h3>Members</h3>
        <ul>
          {members.map(member => (
            <li key={member.id}>{member.name} - {ratingToLevel(member.rating)}</li>
          ))}
        </ul>
      </div>
      <div className="add-member">
        <input type="text" placeholder="Enter new member name" id="new-member-name" />
        <select id="new-member-rating">
          <option value="Classic">Classic</option>
          <option value="Bronze">Bronze</option>
          <option value="Silver">Silver</option>
          <option value="Gold">Gold</option>
          <option value="Platinum">Platinum</option>
        </select>
        <button onClick={() => {
          const name = document.getElementById('new-member-name').value;
          const ratingString = document.getElementById('new-member-rating').value;
          const rating = convertRating(ratingString);
          addMember(name, rating);
        }}>Add Member</button>
      </div>
    </div>
  );
};

export default MemberClub;
