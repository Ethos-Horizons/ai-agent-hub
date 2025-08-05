import React, { useState } from 'react'
import { SettingsIcon, Key, Database, Bell, Shield, Zap, Globe, Bot, Users, Building, ArrowRight, ArrowLeft, ArrowUp, ArrowDown, Link, Cpu, BarChart3, Calendar, MessageSquare, FileText, Image, Video, Mail, Phone, Monitor, Smartphone, Cloud, Lock, Unlock, CheckCircle, Clock, Target, TrendingUp, Layers, Network, Workflow } from 'lucide-react'

export default function Settings() {
  const [activeTab, setActiveTab] = useState('ecosystem')

  const tabs = [
    { id: 'ecosystem', name: 'Ecosystem Overview', icon: Network },
    { id: 'general', name: 'General', icon: SettingsIcon },
    { id: 'security', name: 'Security', icon: Shield },
    { id: 'integrations', name: 'Integrations', icon: Link },
    { id: 'notifications', name: 'Notifications', icon: Bell },
    { id: 'advanced', name: 'Advanced', icon: Zap }
  ]

  const renderEcosystemOverview = () => (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Ethos Digital AI Ecosystem</h2>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          A comprehensive AI-powered ecosystem designed to automate and optimize digital marketing services 
          for both our agency and our clients.
        </p>
      </div>

      {/* System Architecture */}
      <div className="card">
        <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
          <Layers className="w-6 h-6 mr-3 text-primary-600" />
          System Architecture Overview
        </h3>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Client Website */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Globe className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">Client Website</h4>
                <p className="text-sm text-gray-500">Public-facing business sites</p>
              </div>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex items-center space-x-2">
                <MessageSquare className="w-4 h-4 text-green-500" />
                <span>Integrated AI Chatbot</span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-blue-500" />
                <span>Appointment Scheduling</span>
              </div>
              <div className="flex items-center space-x-2">
                <Users className="w-4 h-4 text-purple-500" />
                <span>Lead Qualification</span>
              </div>
            </div>
          </div>

                     {/* AI Hub */}
           <div className="space-y-4">
             <div className="flex items-center space-x-3">
               <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                 <Bot className="w-6 h-6 text-primary-600" />
               </div>
               <div>
                 <h4 className="font-semibold text-gray-900">AI Hub</h4>
                 <p className="text-sm text-gray-500">Agent creation & management</p>
               </div>
             </div>
            <div className="space-y-2 text-sm">
              <div className="flex items-center space-x-2">
                <Cpu className="w-4 h-4 text-orange-500" />
                <span>Agent Development</span>
              </div>
              <div className="flex items-center space-x-2">
                <BarChart3 className="w-4 h-4 text-indigo-500" />
                <span>Performance Analytics</span>
              </div>
              <div className="flex items-center space-x-2">
                <SettingsIcon className="w-4 h-4 text-gray-500" />
                <span>Configuration & Testing</span>
              </div>
            </div>
          </div>

          {/* Central Management System */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Building className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">Central Management</h4>
                <p className="text-sm text-gray-500">Team & client portal</p>
              </div>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex items-center space-x-2">
                <Users className="w-4 h-4 text-blue-500" />
                <span>Team Dashboard</span>
              </div>
              <div className="flex items-center space-x-2">
                <Monitor className="w-4 h-4 text-purple-500" />
                <span>Client Portal</span>
              </div>
              <div className="flex items-center space-x-2">
                <Workflow className="w-4 h-4 text-teal-500" />
                <span>Workflow Management</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Data Flow Diagram */}
      <div className="card">
        <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
          <ArrowRight className="w-6 h-6 mr-3 text-primary-600" />
          Data Flow & Integration
        </h3>
        
        <div className="relative">
          {/* Flow Diagram */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 items-center">
            {/* Client Website */}
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <Globe className="w-8 h-8 text-blue-600" />
              </div>
              <p className="text-sm font-medium">Client Website</p>
            </div>
            
            {/* Arrow */}
            <div className="flex items-center justify-center">
              <ArrowRight className="w-8 h-8 text-gray-400" />
            </div>
            
            {/* AI Dashboard */}
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <Bot className="w-8 h-8 text-primary-600" />
              </div>
              <p className="text-sm font-medium">AI Dashboard</p>
            </div>
            
            {/* Arrow */}
            <div className="flex items-center justify-center">
              <ArrowRight className="w-8 h-8 text-gray-400" />
            </div>
            
            {/* Central System */}
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <Building className="w-8 h-8 text-green-600" />
              </div>
              <p className="text-sm font-medium">Central System</p>
            </div>
          </div>
          
          {/* Data Types */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">Lead Data</h4>
              <p className="text-sm text-gray-600">Visitor interactions, qualifications, contact info</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">Agent Performance</h4>
              <p className="text-sm text-gray-600">Success rates, response times, optimization data</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">Client Analytics</h4>
              <p className="text-sm text-gray-600">Website metrics, social media data, campaign results</p>
            </div>
          </div>
        </div>
      </div>

      {/* Agent Types & Capabilities */}
      <div className="card">
        <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
          <Cpu className="w-6 h-6 mr-3 text-primary-600" />
          AI Agent Types & Capabilities
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Customer Service Agent */}
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-blue-600" />
              </div>
              <h4 className="font-semibold text-gray-900">Customer Service</h4>
            </div>
            <p className="text-sm text-gray-600 mb-3">
              Handles customer inquiries, lead qualification, and basic support
            </p>
            <div className="space-y-1 text-xs">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-3 h-3 text-green-500" />
                <span>24/7 availability</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-3 h-3 text-green-500" />
                <span>Multi-language support</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-3 h-3 text-green-500" />
                <span>Lead qualification</span>
              </div>
            </div>
          </div>

          {/* Appointment Scheduler */}
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-5 h-5 text-green-600" />
              </div>
              <h4 className="font-semibold text-gray-900">Appointment Scheduler</h4>
            </div>
            <p className="text-sm text-gray-600 mb-3">
              Manages calendar integration, booking, and confirmation
            </p>
            <div className="space-y-1 text-xs">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-3 h-3 text-green-500" />
                <span>Calendar integration</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-3 h-3 text-green-500" />
                <span>Email confirmations</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-3 h-3 text-green-500" />
                <span>Lead summary generation</span>
              </div>
            </div>
          </div>

          {/* Content Creator */}
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-purple-600" />
              </div>
              <h4 className="font-semibold text-gray-900">Content Creator</h4>
            </div>
            <p className="text-sm text-gray-600 mb-3">
              Generates blog posts, social media content, and marketing copy
            </p>
            <div className="space-y-1 text-xs">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-3 h-3 text-green-500" />
                <span>SEO-optimized content</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-3 h-3 text-green-500" />
                <span>Brand voice consistency</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-3 h-3 text-green-500" />
                <span>Multi-platform publishing</span>
              </div>
            </div>
          </div>

          {/* Analytics Expert */}
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-indigo-600" />
              </div>
              <h4 className="font-semibold text-gray-900">Analytics Expert</h4>
            </div>
            <p className="text-sm text-gray-600 mb-3">
              Analyzes performance data and provides actionable insights
            </p>
            <div className="space-y-1 text-xs">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-3 h-3 text-green-500" />
                <span>Performance tracking</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-3 h-3 text-green-500" />
                <span>ROI analysis</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-3 h-3 text-green-500" />
                <span>Optimization recommendations</span>
              </div>
            </div>
          </div>

          {/* Social Media Manager */}
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-10 h-10 bg-pink-100 rounded-lg flex items-center justify-center">
                <Smartphone className="w-5 h-5 text-pink-600" />
              </div>
              <h4 className="font-semibold text-gray-900">Social Media Manager</h4>
            </div>
            <p className="text-sm text-gray-600 mb-3">
              Manages social media presence and engagement
            </p>
            <div className="space-y-1 text-xs">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-3 h-3 text-green-500" />
                <span>Multi-platform posting</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-3 h-3 text-green-500" />
                <span>Engagement monitoring</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-3 h-3 text-green-500" />
                <span>Trend analysis</span>
              </div>
            </div>
          </div>

          {/* SEO Specialist */}
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <Target className="w-5 h-5 text-orange-600" />
              </div>
              <h4 className="font-semibold text-gray-900">SEO Specialist</h4>
            </div>
            <p className="text-sm text-gray-600 mb-3">
              Optimizes websites for search engines and organic traffic
            </p>
            <div className="space-y-1 text-xs">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-3 h-3 text-green-500" />
                <span>Keyword research</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-3 h-3 text-green-500" />
                <span>Technical SEO</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-3 h-3 text-green-500" />
                <span>Ranking optimization</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Integration Capabilities */}
      <div className="card">
        <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
          <Link className="w-6 h-6 mr-3 text-primary-600" />
          Third-Party Integrations
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Calendar & Email */}
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Calendar className="w-8 h-8 text-blue-600" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">Calendar & Email</h4>
            <div className="space-y-1 text-sm text-gray-600">
              <p>Google Calendar</p>
              <p>Outlook</p>
              <p>Gmail</p>
              <p>Microsoft 365</p>
            </div>
          </div>

          {/* Social Media */}
          <div className="text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Smartphone className="w-8 h-8 text-purple-600" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">Social Media</h4>
            <div className="space-y-1 text-sm text-gray-600">
              <p>Facebook</p>
              <p>Instagram</p>
              <p>LinkedIn</p>
              <p>Twitter/X</p>
            </div>
          </div>

          {/* Analytics */}
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <BarChart3 className="w-8 h-8 text-green-600" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">Analytics</h4>
            <div className="space-y-1 text-sm text-gray-600">
              <p>Google Analytics</p>
              <p>Google Search Console</p>
              <p>Facebook Insights</p>
              <p>Custom APIs</p>
            </div>
          </div>

          {/* Business Tools */}
          <div className="text-center">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Building className="w-8 h-8 text-orange-600" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">Business Tools</h4>
            <div className="space-y-1 text-sm text-gray-600">
              <p>CRM Systems</p>
              <p>Project Management</p>
              <p>Communication Tools</p>
              <p>File Storage</p>
            </div>
          </div>
        </div>
      </div>

      {/* Development Roadmap */}
      <div className="card">
        <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
          <TrendingUp className="w-6 h-6 mr-3 text-primary-600" />
          Development Roadmap
        </h3>
        
        <div className="space-y-6">
          {/* Phase 1 - Current */}
          <div className="border-l-4 border-green-500 pl-4">
            <div className="flex items-center space-x-3 mb-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <h4 className="font-semibold text-gray-900">Phase 1: Foundation & Chatbot</h4>
            </div>
                         <p className="text-sm text-gray-600 mb-2">✅ AI Hub with chatbot integration</p>
            <p className="text-sm text-gray-600 mb-2">✅ Appointment scheduling detection</p>
            <p className="text-sm text-gray-600">✅ Multi-agent testing environment</p>
          </div>

          {/* Phase 2 - Next */}
          <div className="border-l-4 border-blue-500 pl-4">
            <div className="flex items-center space-x-3 mb-2">
              <Clock className="w-5 h-5 text-blue-500" />
              <h4 className="font-semibold text-gray-900">Phase 2: Core Integrations</h4>
            </div>
            <p className="text-sm text-gray-600 mb-2">🔄 Calendar integration (Google/Outlook)</p>
            <p className="text-sm text-gray-600 mb-2">🔄 Email automation system</p>
            <p className="text-sm text-gray-600">🔄 Lead management system</p>
          </div>

          {/* Phase 3 */}
          <div className="border-l-4 border-purple-500 pl-4">
            <div className="flex items-center space-x-3 mb-2">
              <Target className="w-5 h-5 text-purple-500" />
              <h4 className="font-semibold text-gray-900">Phase 3: Advanced Agents</h4>
            </div>
            <p className="text-sm text-gray-600 mb-2">📋 Content creation agents</p>
            <p className="text-sm text-gray-600 mb-2">📋 Social media management</p>
            <p className="text-sm text-gray-600">📋 SEO optimization agents</p>
          </div>

          {/* Phase 4 */}
          <div className="border-l-4 border-orange-500 pl-4">
            <div className="flex items-center space-x-3 mb-2">
              <Building className="w-5 h-5 text-orange-500" />
              <h4 className="font-semibold text-gray-900">Phase 4: Central Management System</h4>
            </div>
            <p className="text-sm text-gray-600 mb-2">🏢 Team dashboard & client portal</p>
            <p className="text-sm text-gray-600 mb-2">🏢 Multi-client management</p>
            <p className="text-sm text-gray-600">🏢 Advanced analytics & reporting</p>
          </div>
        </div>
      </div>

      {/* Business Benefits */}
      <div className="card">
        <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
          <Zap className="w-6 h-6 mr-3 text-primary-600" />
          Business Benefits & ROI
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-900">For Ethos Digital</h4>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-900">Automated Lead Qualification</p>
                  <p className="text-sm text-gray-600">24/7 lead capture and qualification</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-900">Scalable Operations</p>
                  <p className="text-sm text-gray-600">Handle more clients without proportional staff increase</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-900">Data-Driven Insights</p>
                  <p className="text-sm text-gray-600">Comprehensive analytics for optimization</p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold text-gray-900">For Clients</h4>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-900">Instant Support</p>
                  <p className="text-sm text-gray-600">Immediate responses to inquiries</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-900">Transparent Reporting</p>
                  <p className="text-sm text-gray-600">Real-time access to campaign performance</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-900">Cost Efficiency</p>
                  <p className="text-sm text-gray-600">Automated tasks reduce service costs</p>
                </div>
              </div>
            </div>
          </div>
        </div>
             </div>
     </div>
   )

  const renderGeneralSettings = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-gray-900">General Settings</h3>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Company Name
        </label>
        <input
          type="text"
          defaultValue="Ethos Digital"
          className="input-field"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Time Zone
        </label>
        <select className="input-field">
          <option value="America/New_York">Eastern Time (ET)</option>
          <option value="America/Chicago">Central Time (CT)</option>
          <option value="America/Denver">Mountain Time (MT)</option>
          <option value="America/Los_Angeles">Pacific Time (PT)</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Default Language
        </label>
        <select className="input-field">
          <option value="en">English</option>
          <option value="es">Spanish</option>
          <option value="fr">French</option>
        </select>
      </div>
    </div>
  )

  const renderSecuritySettings = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-gray-900">Security Settings</h3>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Session Timeout (minutes)
        </label>
        <input
          type="number"
          defaultValue="30"
          className="input-field"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Rate Limiting (requests per minute)
        </label>
        <input
          type="number"
          defaultValue="100"
          className="input-field"
        />
      </div>

      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
        <div>
          <h4 className="text-sm font-medium text-gray-900">Two-Factor Authentication</h4>
          <p className="text-sm text-gray-500">Add an extra layer of security</p>
        </div>
        <button className="btn-secondary">
          Enable 2FA
        </button>
      </div>
    </div>
  )

  const renderIntegrationsSettings = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-gray-900">Integration Settings</h3>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Google Calendar API
        </label>
        <input
          type="password"
          placeholder="Enter your Google Calendar API key"
          className="input-field"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Email Service (SMTP)
        </label>
        <input
          type="text"
          placeholder="smtp.gmail.com:587"
          className="input-field"
        />
      </div>

      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
        <div>
          <h4 className="text-sm font-medium text-gray-900">Test Integrations</h4>
          <p className="text-sm text-gray-500">Verify all integrations are working</p>
        </div>
        <button className="btn-secondary">
          Test All
        </button>
      </div>
    </div>
  )

  const renderNotificationsSettings = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-gray-900">Notification Settings</h3>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-sm font-medium text-gray-900">Email Notifications</h4>
            <p className="text-sm text-gray-500">Receive notifications via email</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" className="sr-only peer" defaultChecked />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
          </label>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-sm font-medium text-gray-900">Agent Status Alerts</h4>
            <p className="text-sm text-gray-500">Get notified when agents go offline</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" className="sr-only peer" defaultChecked />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
          </label>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-sm font-medium text-gray-900">Lead Notifications</h4>
            <p className="text-sm text-gray-500">Get notified of new qualified leads</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" className="sr-only peer" defaultChecked />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
          </label>
        </div>
      </div>
    </div>
  )

  const renderAdvancedSettings = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-gray-900">Advanced Settings</h3>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Max Concurrent Tasks
        </label>
        <input
          type="number"
          defaultValue="10"
          className="input-field"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Task Queue Size
        </label>
        <input
          type="number"
          defaultValue="100"
          className="input-field"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Cache TTL (seconds)
        </label>
        <input
          type="number"
          defaultValue="300"
          className="input-field"
        />
      </div>

      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
        <div>
          <h4 className="text-sm font-medium text-gray-900">System Health</h4>
          <p className="text-sm text-gray-500">Check system performance and health</p>
        </div>
        <button className="btn-secondary">
          Run Health Check
        </button>
      </div>
    </div>
  )

  const renderContent = () => {
    switch (activeTab) {
      case 'ecosystem':
        return renderEcosystemOverview()
      case 'general':
        return renderGeneralSettings()
      case 'security':
        return renderSecuritySettings()
      case 'integrations':
        return renderIntegrationsSettings()
      case 'notifications':
        return renderNotificationsSettings()
      case 'advanced':
        return renderAdvancedSettings()
      default:
        return renderEcosystemOverview()
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="mt-1 text-sm text-gray-500">
          Configure your AI Hub settings
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="card">
            <nav className="space-y-1">
              {tabs.map((tab) => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                      activeTab === tab.id
                        ? 'bg-primary-100 text-primary-900'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <Icon className="mr-3 h-5 w-5" />
                    {tab.name}
                  </button>
                )
              })}
            </nav>
          </div>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          <div className="card">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  )
} 