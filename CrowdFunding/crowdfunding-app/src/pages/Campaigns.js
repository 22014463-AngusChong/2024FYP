import React, { useEffect } from 'react';
import './Campaigns.css';

const Campaigns = () => {
  useEffect(() => {
    // Initial Ratings
    const ratings = {
      breastcancer: 4.7,
      adoption: 3.5,
      africa: 4.3,
      childreneducation: 4.8,
      homeless: 4.2
    };

    // Total Stars
    const starsTotal = 5;

    // Get ratings
    function getRatings() {
      for (let rating in ratings) {
        // Get percentage
        const starPercentage = (ratings[rating] / starsTotal) * 100;

        // Round to nearest 10
        const starPercentageRounded = `${Math.round(starPercentage / 10) * 10}%`;

        // Set width of stars-inner to percentage
        const starInner = document.querySelector(`.${rating} .stars-inner`);
        if (starInner) {
          starInner.style.width = starPercentageRounded;
        }

        // Add number rating
        const numberRating = document.querySelector(`.${rating} .number-rating`);
        if (numberRating) {
          numberRating.innerHTML = ratings[rating];
        }

        // Update progress bar
        const progressBar = document.querySelector(`.${rating} progress`);
        if (progressBar) {
          progressBar.value = starPercentage;
        }
      }
    }

    // Run getRatings when DOM loads
    document.addEventListener('DOMContentLoaded', getRatings);

    // Form Elements
    const campaignSelect = document.getElementById('campaign-select');
    const ratingControl = document.getElementById('rating-control');

    // Init campaign
    let campaign;

    // Campaign select change
    if (campaignSelect) {
      campaignSelect.addEventListener('change', (e) => {
        campaign = e.target.value;
        // Enable rating control
        if (ratingControl) {
          ratingControl.disabled = false;
          ratingControl.value = ratings[campaign];
        }
      });
    }

    // Rating control change
    if (ratingControl) {
      ratingControl.addEventListener('blur', (e) => {
        const rating = e.target.value;

        // Make sure 5 or under
        if (rating > 5) {
          alert('Please rate 1 - 5');
          return;
        }

        // Change rating
        ratings[campaign] = rating;

        getRatings();
      });
    }

    getRatings();
  }, []);

  return (
    <div className="container mt-5">
      <h2 className="title">Campaign Ratings</h2>
      <div className="form-group">
        <select id="campaign-select" className="form-control custom-select">
          <option value="0" disabled selected>Select Campaign</option>
          <option value="breastcancer">Help Breast Cancer</option>
          <option value="adoption">Help Adoption</option>
          <option value="africa">Help Africa</option>
          <option value="childreneducation">Help Children Education</option>
          <option value="homeless">Help Homeless</option>
        </select>
      </div>
      <div className="form-group">
        <input type="number" id="rating-control" className="form-control" step="0.1" max="5" placeholder="Rate 1 - 5" disabled />
      </div>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Campaign</th>
            <th>Description</th>
            <th>Progress</th>
            <th>Rating</th>
          </tr>
        </thead>
        <tbody>
          <tr className="breastcancer">
            <td>Help Breast Cancer</td>
            <td>Support research and treatment for breast cancer patients.</td>
            <td><progress value="70" max="100"></progress></td>
            <td>
              <div className="stars-outer">
                <div className="stars-inner"></div>
              </div>
              <span className="number-rating">4.7</span>
            </td>
          </tr>
          <tr className="adoption">
            <td>Help Adoption</td>
            <td>Provide support for adoption processes.</td>
            <td><progress value="50" max="100"></progress></td>
            <td>
              <div className="stars-outer">
                <div className="stars-inner"></div>
              </div>
              <span className="number-rating">3.5</span>
            </td>
          </tr>
          <tr className="africa">
            <td>Help Africa</td>
            <td>Provide resources and aid to communities in Africa.</td>
            <td><progress value="85" max="100"></progress></td>
            <td>
              <div className="stars-outer">
                <div className="stars-inner"></div>
              </div>
              <span className="number-rating">4.3</span>
            </td>
          </tr>
          <tr className="childreneducation">
            <td>Help Children Education</td>
            <td>Ensure education for underprivileged children.</td>
            <td><progress value="90" max="100"></progress></td>
            <td>
              <div className="stars-outer">
                <div className="stars-inner"></div>
              </div>
              <span className="number-rating">4.8</span>
            </td>
          </tr>
          <tr className="homeless">
            <td>Help Homeless</td>
            <td>Support homeless shelters and provide resources.</td>
            <td><progress value="60" max="100"></progress></td>
            <td>
              <div className="stars-outer">
                <div className="stars-inner"></div>
              </div>
              <span className="number-rating">4.2</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default Campaigns;
