import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/DashboardLayout';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Input from '../../components/Input';
import ImageUpload from '../../components/ImageUpload';
import LocationPicker from '../../components/LocationPicker';
import ToggleSwitch from '../../components/ToggleSwitch';
import { useToast } from '../../components/Toast';
import { useAuth } from '../../context/AuthContext';

const UnitFormEnhanced = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToast } = useToast();
  const isEdit = Boolean(id);
  
  const [loading, setLoading] = useState(isEdit);
  const [submitting, setSubmitting] = useState(false);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [pendingImages, setPendingImages] = useState([]);
  const [errors, setErrors] = useState({});
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState([]);
  
  // Redirect if not verified
  useEffect(() => {
    if (!user?.verified) {
      addToast('Please complete verification to manage units', 'error');
      navigate('/host/verification');
    }
  }, [user, navigate, addToast]);

  const [formData, setFormData] = useState({
    name: '',
    type: 'Apartment',
    location: '',
    latitude: null,
    longitude: null,
    description: '',
    pricePerNight: '',
    baseGuestsIncluded: '2',
    nightHours: '22',
