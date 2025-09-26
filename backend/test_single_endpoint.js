/**
 * Single Endpoint Test Script
 * 
 * This script tests individual API endpoints to isolate issues
 */

import axios from 'axios';

const baseURL = 'http://localhost:4000';
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImVtYWlsIjoidGVzdC11c2VyQGplc3QtdGVzdHMuY29tIiwibHQiOm51bGwsImlhdCI6MTc1ODg2MTUxNywiZXhwIjoxNzU4ODYyNDE3fQ.nZyqDDazrm4ix7LjugBghZXNm0vP9w_7JoewLbmzqBk';

async function testEndpoints() {
  try {
    console.log('🧪 Testing individual API endpoints...\n');
    
    // Test 1: Create a project
    console.log('1️⃣ Testing POST /projects');
    const createResponse = await axios.post(`${baseURL}/projects`, {
      title: 'Test Project from Script',
      description: 'This is a test description.'
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    console.log('✅ Create project:', {
      status: createResponse.status,
      id: createResponse.data.id,
      title: createResponse.data.title
    });
    
    const projectId = createResponse.data.id;
    
    // Test 2: Get all projects
    console.log('\n2️⃣ Testing GET /projects');
    const getAllResponse = await axios.get(`${baseURL}/projects`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    console.log('✅ Get all projects:', {
      status: getAllResponse.status,
      count: getAllResponse.data.length
    });
    
    // Test 3: Get single project
    console.log('\n3️⃣ Testing GET /projects/:id');
    const getSingleResponse = await axios.get(`${baseURL}/projects/${projectId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    console.log('✅ Get single project:', {
      status: getSingleResponse.status,
      id: getSingleResponse.data.id,
      title: getSingleResponse.data.title
    });
    
    // Test 4: Update project
    console.log('\n4️⃣ Testing PATCH /projects/:id');
    const updateResponse = await axios.patch(`${baseURL}/projects/${projectId}`, {
      title: 'Updated Test Project',
      description: 'Updated description'
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    console.log('✅ Update project:', {
      status: updateResponse.status,
      title: updateResponse.data.title
    });
    
    // Test 5: Get non-existent project
    console.log('\n5️⃣ Testing GET /projects/99999 (non-existent)');
    try {
      await axios.get(`${baseURL}/projects/99999`, {
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch (error) {
      console.log('✅ Non-existent project:', {
        status: error.response.status,
        message: error.response.data.error
      });
    }
    
    // Test 6: Delete project
    console.log('\n6️⃣ Testing DELETE /projects/:id');
    const deleteResponse = await axios.delete(`${baseURL}/projects/${projectId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    console.log('✅ Delete project:', {
      status: deleteResponse.status
    });
    
    console.log('\n🎉 All endpoint tests completed successfully!');
    
  } catch (error) {
    console.error('❌ Test failed:', {
      status: error.response?.status,
      message: error.response?.data?.error || error.message,
      url: error.config?.url
    });
  }
}

testEndpoints();