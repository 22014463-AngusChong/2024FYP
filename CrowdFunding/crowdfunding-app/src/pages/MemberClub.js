import React, { useEffect, useState } from 'react';
import './MemberClub.css';

const MemberClub = ({ account, contract }) => {
  const [members, setMembers] = useState([]);

  useEffect(() => {
    const loadMembers = async () => {
      if (contract) {
        const userAddresses = [
          "0xaF276C60F8E9DBB6881147f3c84a343d3618C24d", // Example valid address
          "0x70747Fc10779220910FE04Fb98290D192170B80D", // Example valid address
          "0x95b43797aA875edC90340eccF01f57f155b75D49"  // Example valid address
        ]; 
        const members = await Promise.all(userAddresses.map(async (address) => {
          const rating = await contract.methods.getUserRating(address).call();
          let membershipLevel = 'Classic';
          if (rating == 2) membershipLevel = 'Bronze';
          else if (rating == 3) membershipLevel = 'Silver';
          else if (rating == 4) membershipLevel = 'Gold';
          else if (rating == 5) membershipLevel = 'Platinum';
          return { id: address, name: address, membershipLevel };
        }));
        setMembers(members);
      }
    };
    loadMembers();
  }, [contract]);
                
  return (
    <div className="member-club-container">
      <div className="member-header">
        <h1>Member Club</h1>
        <p>There are 5 different member levels:</p>
      </div>
      <div className="member-levels">
        <div className="level">
          <h2>Classic</h2>
          <p>Donated less than 0.5 ETH</p>
        </div>
        <div className="level">
          <h2>Bronze</h2>
          <p>Donated 0.5 ETH to 1 ETH</p>
        </div>
        <div className="level">
          <h2>Silver</h2>
          <p>Donated 1 ETH to 5 ETH</p>
        </div>
        <div className="level">
          <h2>Gold</h2>
          <p>Donated 5 ETH to 10 ETH</p>
        </div>
        <div className="level">
          <h2>Platinum</h2>
          <p>Donated more than 10 ETH</p>
        </div>
      </div>
      <div className="member-list">
        <h3>Members</h3>
        <ul>
          {members.map(member => (
            <li key={member.id}>{member.name} - {member.membershipLevel}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default MemberClub;


