import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, Avatar, Input, Button, Typography, Space, Divider, message } from 'antd';
import { UserOutlined, MailOutlined, LinkOutlined, ClockCircleOutlined, EditOutlined, CameraOutlined } from '@ant-design/icons';
import Auth from './Auth';
import { useAuth } from '../context/AuthContext';
import './Profile.css';

const { Title, Text, Paragraph } = Typography;

const Profile = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [profile, setProfile] = useState({
    name: 'Usuario',
    avatar: null,
    cover: null,
    description: 'Agrega una descripción sobre ti...',
    email: 'usuario@ejemplo.com',
    links: ['https://misitio.com'],
    createdAt: new Date() // Fecha de creación de la cuenta
  });
  const [newLink, setNewLink] = useState('');
  const [isEditing, setIsEditing] = useState({
    name: false,
    description: false,
    email: false,
    links: false
  });
  
  // Formatear la fecha de creación
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Actualizar la hora en tiempo real
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfile({ ...profile, avatar: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCoverChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfile({ ...profile, cover: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddLink = () => {
    if (newLink && !profile.links.includes(newLink)) {
      setProfile({
        ...profile,
        links: [...profile.links, newLink]
      });
      setNewLink('');
      message.success('Enlace agregado correctamente');
    }
  };

  const handleRemoveLink = (linkToRemove) => {
    setProfile({
      ...profile,
      links: profile.links.filter(link => link !== linkToRemove)
    });
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });
  };

  const { currentUser } = useAuth();

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-slate-900 p-6 shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-10 ml-2">
            <Link to="/" className="text-2xl font-bold cursor-pointer">
              <span className="bg-white text-slate-900 px-2 py-1 rounded">StudyHub</span>
            </Link>
            <nav className="flex gap-4 text-white font-medium">
              <Link to="/simulacros" className="hover:underline">Simulacros</Link>
              <a href="/Recursos.html" className="hover:underline">Recursos</a>
            </nav>
          </div>
          <div className="flex gap-3 justify-center sm:justify-end mr-2">
            <Auth />
          </div>
        </div>
      </header>

      <div className="profile-container">
        {/* Portada */}
      <div className="profile-cover" style={profile.cover ? { backgroundImage: `url(${profile.cover})` } : {}}>
        {!profile.cover && (
          <div className="cover-watermark">
            <span>StudyHub</span>
          </div>
        )}
        <div className="cover-upload">
          <label htmlFor="cover-upload" className="cover-upload-btn">
            <CameraOutlined style={{ fontSize: '20px' }} />
          </label>
          <input
            id="cover-upload"
            type="file"
            accept="image/*"
            onChange={handleCoverChange}
            style={{ display: 'none' }}
          />
        </div>
      </div>

      <div className="profile-content">
        {/* Avatar y nombre */}
        <div className="profile-header">
          <div className="avatar-container">
            <Avatar 
              size={120} 
              src={profile.avatar} 
              icon={<UserOutlined style={{ color: '#333333' }} />} 
              className="profile-avatar"
            />
            <label htmlFor="avatar-upload" className="avatar-upload-btn">
              Cambiar foto
            </label>
            <input
              id="avatar-upload"
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              style={{ display: 'none' }}
            />
          </div>
          <div className="profile-name-section">
            {isEditing.name ? (
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <Input
                  value={profile.name}
                  onChange={(e) => setProfile({...profile, name: e.target.value})}
                  style={{ width: '200px' }}
                />
                <Button 
                  type="primary" 
                  onClick={() => setIsEditing({...isEditing, name: false})}
                >
                  Guardar
                </Button>
              </div>
            ) : (
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <Title level={2} className="profile-name">
                  {profile.name}
                </Title>
                <Button 
                  type="text" 
                  icon={<EditOutlined />} 
                  onClick={() => setIsEditing({...isEditing, name: true})}
                />
              </div>
            )}
            <Text type="secondary">
              Miembro desde: {formatDate(profile.createdAt)}
            </Text>
          </div>
        </div>

        {/* Mensaje de bienvenida */}
        <div className="welcome-message" style={{ margin: '20px 0' }}>
          <Title level={3} style={{ color: '#ffffff', margin: '0 0 8px 0' }}>
            ¡Bienvenido a StudyHub, {profile.name}!
          </Title>
          <Text type="secondary" style={{ color: '#a0a0a0', fontSize: '16px' }}>
            Tu espacio de aprendizaje personal
          </Text>
        </div>

        {/* Hora en tiempo real */}
        <div className="time-display">
          <ClockCircleOutlined />
          <Text type="secondary" style={{ marginLeft: 8 }}>
            {formatTime(currentTime)}
          </Text>
        </div>

        <Divider>Información del perfil</Divider>

        {/* Descripción */}
        <div className="profile-section">
          <Title level={4}>Acerca de mí</Title>
          {isEditing.description ? (
            <div>
              <Input.TextArea
                value={profile.description}
                onChange={(e) => setProfile({...profile, description: e.target.value})}
                autoSize={{ minRows: 3, maxRows: 6 }}
              />
              <Button 
                type="primary" 
                onClick={() => setIsEditing({...isEditing, description: false})}
                style={{ marginTop: 8 }}
              >
                Guardar
              </Button>
            </div>
          ) : (
            <Paragraph 
              editable={{ onStart: () => setIsEditing({...isEditing, description: true}) }}
            >
              {profile.description}
            </Paragraph>
          )}
        </div>

        {/* Correo electrónico */}
        <div className="profile-section">
          <Title level={4}><MailOutlined /> Correo electrónico</Title>
          {isEditing.email ? (
            <div>
              <Input
                value={profile.email}
                onChange={(e) => setProfile({...profile, email: e.target.value})}
                style={{ width: '100%', maxWidth: 400 }}
              />
              <Button 
                type="primary" 
                onClick={() => setIsEditing({...isEditing, email: false})}
                style={{ marginTop: 8 }}
              >
                Guardar
              </Button>
            </div>
          ) : (
            <Paragraph 
              editable={{ onStart: () => setIsEditing({...isEditing, email: true}) }}
            >
              {profile.email}
            </Paragraph>
          )}
        </div>

        {/* Enlaces */}
        <div className="profile-section">
          <Title level={4}><LinkOutlined /> Enlaces</Title>
          <div className="links-container">
            {profile.links.map((link, index) => (
              <div key={index} className="link-item">
                <a href={link} target="_blank" rel="noopener noreferrer">
                  {link}
                </a>
                <Button 
                  type="text" 
                  danger 
                  size="small"
                  onClick={() => handleRemoveLink(link)}
                >
                  Eliminar
                </Button>
              </div>
            ))}
            <div className="add-link">
              <Input
                placeholder="Agregar enlace"
                value={newLink}
                onChange={(e) => setNewLink(e.target.value)}
                onPressEnter={handleAddLink}
                style={{ width: '100%', maxWidth: 400 }}
              />
              <Button 
                type="primary" 
                onClick={handleAddLink}
                style={{ marginLeft: 8 }}
              >
                Agregar
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default Profile;
