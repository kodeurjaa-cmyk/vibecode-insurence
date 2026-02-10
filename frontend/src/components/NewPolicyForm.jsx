import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaMicrophone, FaUser, FaDollarSign, FaHeartbeat, FaShieldAlt, FaHome } from 'react-icons/fa';
import axios from 'axios';
import './NewPolicyForm.css';

const NewPolicyForm = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        age: '',
        income: '',
        lifestyle: 'medium',
        medical_history: false,
        insurance_type: 'life',
        coverage_amount: '',
    });
    const [loading, setLoading] = useState(false);
    const [listening, setListening] = useState(false);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleVoiceInput = () => {
        if (!('webkitSpeechRecognition' in window)) {
            alert('Voice input is not supported in your browser');
            return;
        }

        const recognition = new window.webkitSpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';

        recognition.onstart = () => {
            setListening(true);
        };

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;

            // Simple parsing of voice input
            const ageMatch = transcript.match(/age\s+(?:is\s+)?(\d+)/i);
            const incomeMatch = transcript.match(/income\s+(?:is\s+)?(\d+)/i);
            const coverageMatch = transcript.match(/coverage\s+(?:is\s+)?(\d+)/i);

            if (ageMatch) setFormData(prev => ({ ...prev, age: ageMatch[1] }));
            if (incomeMatch) setFormData(prev => ({ ...prev, income: incomeMatch[1] }));
            if (coverageMatch) setFormData(prev => ({ ...prev, coverage_amount: coverageMatch[1] }));

            setListening(false);
        };

        recognition.onerror = () => {
            setListening(false);
            alert('Voice recognition error. Please try again.');
        };

        recognition.onend = () => {
            setListening(false);
        };

        recognition.start();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        console.log('Form submitted with data:', formData);

        try {
            const payload = {
                client_details: {
                    age: parseInt(formData.age),
                    income: parseFloat(formData.income),
                    lifestyle: formData.lifestyle,
                    medical_history: formData.medical_history
                },
                insurance_details: {
                    type: formData.insurance_type,
                    coverage_amount: parseFloat(formData.coverage_amount)
                }
            };

            console.log('Sending payload:', payload);

            const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/policies/`, payload);

            console.log('Response received:', response);

            if (response.status === 201 && response.data) {
                navigate('/policy-output', { state: { policyData: response.data } });
            }
        } catch (error) {
            console.error('Full error:', error);
            console.error('Error response:', error.response);
            console.error('Error message:', error.message);
            alert(`Failed to generate policy: ${error.response?.data?.error || error.message || 'Unknown error'} (Target: ${import.meta.env.VITE_API_BASE_URL})`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="new-policy-container">
            <div className="policy-header">
                <button className="btn-back" onClick={() => navigate('/')}>
                    <FaArrowLeft /> Back
                </button>
                <h1>Generate New Policy</h1>
                <p>Create your personalized insurance policy in minutes</p>
            </div>

            <div className="form-container card">
                <div className="voice-input-section">
                    <button
                        type="button"
                        className={`voice-btn ${listening ? 'listening' : ''}`}
                        onClick={handleVoiceInput}
                    >
                        <FaMicrophone />
                        {listening ? 'Listening...' : 'Speak to fill form'}
                    </button>
                    <p className="voice-hint">Say something like: "Age is 35, income is 70000, coverage is 200000"</p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="form-grid">
                        <div className="form-group">
                            <label>
                                <FaUser className="field-icon" />
                                Age
                            </label>
                            <input
                                type="number"
                                name="age"
                                value={formData.age}
                                onChange={handleChange}
                                className="input-field"
                                placeholder="Enter your age"
                                required
                                min="18"
                                max="100"
                            />
                        </div>

                        <div className="form-group">
                            <label>
                                <FaDollarSign className="field-icon" />
                                Annual Income
                            </label>
                            <input
                                type="number"
                                name="income"
                                value={formData.income}
                                onChange={handleChange}
                                className="input-field"
                                placeholder="Enter annual income"
                                required
                                min="0"
                            />
                        </div>

                        <div className="form-group">
                            <label>
                                <FaHeartbeat className="field-icon" />
                                Lifestyle
                            </label>
                            <select
                                name="lifestyle"
                                value={formData.lifestyle}
                                onChange={handleChange}
                                className="input-field"
                            >
                                <option value="low">Low Risk</option>
                                <option value="medium">Medium Risk</option>
                                <option value="high">High Risk</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label>
                                <FaShieldAlt className="field-icon" />
                                Insurance Type
                            </label>
                            <select
                                name="insurance_type"
                                value={formData.insurance_type}
                                onChange={handleChange}
                                className="input-field"
                            >
                                <option value="life">Life Insurance</option>
                                <option value="health">Health Insurance</option>
                                <option value="vehicle">Vehicle Insurance</option>
                                <option value="home">Home Insurance</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label>
                                <FaHome className="field-icon" />
                                Coverage Amount
                            </label>
                            <input
                                type="number"
                                name="coverage_amount"
                                value={formData.coverage_amount}
                                onChange={handleChange}
                                className="input-field"
                                placeholder="Required coverage amount"
                                required
                                min="0"
                            />
                            <small>Amount needed to overcome financial risks</small>
                        </div>

                        <div className="form-group checkbox-group">
                            <label className="checkbox-label">
                                <input
                                    type="checkbox"
                                    name="medical_history"
                                    checked={formData.medical_history}
                                    onChange={handleChange}
                                />
                                <span>I have pre-existing medical conditions</span>
                            </label>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary submit-btn"
                        disabled={loading}
                    >
                        {loading ? 'Generating Policy...' : 'Generate Personalized Policy'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default NewPolicyForm;
