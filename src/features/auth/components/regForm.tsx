import React, { useState} from "react";
import {
    isValidEmail,
    isValidPassword,
    isValidName,
    isValidBirthDate,
    isValidStreet,
    isValidCity,
    isValidPostalCode,
    isValidCountry,
} from "../../../utils/validators";

const validCountries = [ 'United States', 'Canada'];

export const RegForm = () => {
    const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    birthDate: '',
    street: '',
    city: '',
    postalCode: '',
    country: '',
  });

 const [errors, setErrors] = useState<{ [key: string]: string }>({});

 const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement> ) => {
  const { name, value} = e.target;
  setFormData((prev) => ( { ...prev, [name]: value}));
 };

  const validate = () => {
    const newErrors: typeof errors = {};

    if (!isValidEmail(formData.email)) newErrors.email = 'Invalid email format';
    if (!isValidPassword(formData.password)) newErrors.password = 'Password must be at least 8 characters, include upper/lowercase and number';
    if (!isValidName(formData.firstName)) newErrors.firstName = 'Invalid first name';
    if (!isValidName(formData.lastName)) newErrors.lastName = 'Invalid last name';
    if (!isValidBirthDate(formData.birthDate)) newErrors.birthDate = 'You must be at least 13 years old';
    if (!isValidStreet(formData.street)) newErrors.street = 'Street cannot be empty';
    if (!isValidCity(formData.city)) newErrors.city = 'Invalid city name';
    if (!isValidPostalCode(formData.postalCode, 'US')) newErrors.postalCode = 'Invalid postal code';
    if (!isValidCountry(formData.country, validCountries)) newErrors.country = 'Select a valid country';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      //connectApi();
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="email" placeholder="Email" value={formData.email} onChange={handleChange} />
      <p>{errors.email}</p>

      <input name="password" type="password" placeholder="Password" value={formData.password} onChange={handleChange} />
      <p>{errors.password}</p>

      <input name="firstName" placeholder="First Name" value={formData.firstName} onChange={handleChange} />
      <p>{errors.firstName}</p>

      <input name="lastName" placeholder="Last Name" value={formData.lastName} onChange={handleChange} />
      <p>{errors.lastName}</p>

      <input name="birthDate" type="date" placeholder="Birth Date" value={formData.birthDate} onChange={handleChange} />
      <p>{errors.birthDate}</p>

      <input name="street" placeholder="Street" value={formData.street} onChange={handleChange} />
      <p>{errors.street}</p>

      <input name="city" placeholder="City" value={formData.city} onChange={handleChange} />
      <p>{errors.city}</p>

      <input name="postalCode" placeholder="Postal Code" value={formData.postalCode} onChange={handleChange} />
      <p>{errors.postalCode}</p>

      <select name="country" value={formData.country} onChange={handleChange}>
        <option value="">Select Country</option>
        {validCountries.map((c) => (
          <option key={c} value={c}>{c}</option>
        ))}
      </select>
      <p>{errors.country}</p>

      <button type="submit">Register</button>
    </form>
  );
};