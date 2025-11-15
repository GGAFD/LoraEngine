
import React, { useState, useCallback, useRef, useEffect } from 'react';
import JSZip from 'jszip';
import { generateBaseImage, generateVariationImage, editImage } from './services/geminiService';
import Header from './components/Header';
import Button from './components/Button';
import ImageSlot from './components/ImageSlot';
import HistoryPanel from './components/HistoryPanel';
import type { GeneratedImage, GenerationSlot, HistoryItem } from './types';

// Default image data to pre-load for a better user experience
const defaultImageData = {
    data: '/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAoHCBYVFRgWFhYZGRgaHBocGhwaHBwaHBocHBwcHBwcHBwcIS4lHB4rIRoYJjgmKy8xNTU1GiQ7QDs0Py40NTEBDAwMEA8QHxISHzQrJCs0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NP/AABEIA/MDLAMBIgACEQEDEQH/xAAbAAEAAgMBAQAAAAAAAAAAAAAAAQUDBAYCB//EAEgQAAIBAgQDBgIHBgMGBgMBAAECEQADBBIhMQVBUWEGEyJxgZEyobEHFEJSctHwFTNi4fEkgpKyJENTY3OiwlSDsyVEY6PC/8QAGQEBAQEBAQEAAAAAAAAAAAAAAAECAwQF/8QAIREBAQEAAgICAwEBAQAAAAAAAAERAhIhAzFBURMyYXH/2gAMAwEAAhEDEQA/APx6iiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiig-word-wrap: break-word; color: #374151; font-weight: 400; line-height: 28px; tab-size: 4; -webkit-text-size-adjust: 100%;',
    mimeType: 'image/jpeg',
};
const defaultImageUrl = `data:${defaultImageData.mimeType};base64,${defaultImageData.data}`;


// Helper to convert file to base64
const fileToBase64 = (file: File): Promise<{ data: string, mimeType: string }> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      const base64Data = result.split(',')[1];
      resolve({ data: base64Data, mimeType: file.type });
    };
    reader.onerror = (error) => reject(error);
  });
};

// Helper to convert a data URL back to base64 object
const dataUrlToBase64 = (dataUrl: string): { data: string, mimeType: string } => {
    const parts = dataUrl.split(',');
    const mimeType = parts[0].match(/:(.*?);/)?.[1] || 'image/jpeg';
    const data = parts[1];
    return { data, mimeType };
};

type Mode = 'generate' | 'edit';

const App: React.FC = () => {
  const [mode, setMode] = useState<Mode>('generate');
  const [baseImage, setBaseImage] = useState<GeneratedImage | null>(null);
  const [generationSlots, setGenerationSlots] = useState<GenerationSlot[]>([]);
  const [editedImage, setEditedImage] = useState<GeneratedImage | null>(null);
  const [editPrompt, setEditPrompt] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingMessage, setLoadingMessage] = useState<string>('');
  const [isDownloading, setIsDownloading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([defaultImageUrl]);
  const [base64Images, setBase64Images] = useState<{ data: string, mimeType: string }[]>([defaultImageData]);
  const [age, setAge] = useState<number>(25);
  
  const [history, setHistory] = useState<HistoryItem[]>([]);
  
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load history from localStorage on initial render
  useEffect(() => {
    try {
        const storedHistory = localStorage.getItem('ai-image-suite-history');
        if (storedHistory) {
            setHistory(JSON.parse(storedHistory));
        }
    } catch (e) {
        console.error("Failed to load history from localStorage", e);
    }
  }, []);

  // Save history to localStorage whenever it changes
  useEffect(() => {
    try {
        localStorage.setItem('ai-image-suite-history', JSON.stringify(history));
    } catch (e) {
        console.error("Failed to save history to localStorage", e);
    }
  }, [history]);

  const clearResults = () => {
    setBaseImage(null);
    setGenerationSlots([]);
    setEditedImage(null);
    setError(null);
  };
  
  const handleModeChange = (newMode: Mode) => {
    setMode(newMode);
    clearResults();
  };
  
  // Cleanup preview URLs on unmount
  useEffect(() => {
    const urls = previewUrls;
    return () => {
      // Only revoke object URLs, not data URLs
      urls.filter(url => url.startsWith('blob:')).forEach(url => URL.revokeObjectURL(url));
    }
  }, [previewUrls]);

  const handleFilesSelect = useCallback(async (files: FileList | null) => {
    if (!files) return;
    clearResults();

    const newFiles = Array.from(files).filter(file => file.type.startsWith('image/'));

    if (newFiles.length === 0) {
      setError('Please select valid image files.');
      return;
    }
    
    setError(null);
    setSelectedFiles(prev => [...prev, ...newFiles]);

    const newPreviewUrls = newFiles.map(file => URL.createObjectURL(file));
    setPreviewUrls(prev => [...prev, ...newPreviewUrls]);

    try {
        const newImageDataPromises = newFiles.map(file => fileToBase64(file));
        const newImageDatas = await Promise.all(newImageDataPromises);
        setBase64Images(prev => [...prev, ...newImageDatas]);
    } catch (e) {
        setError('Could not read the selected files.');
        // Clean up failed additions
        setSelectedFiles(selectedFiles);
        setPreviewUrls(previewUrls);
    }
  }, [selectedFiles, previewUrls]);

  const handleRemoveImage = useCallback((indexToRemove: number) => {
      const urlToRemove = previewUrls[indexToRemove];
      if (urlToRemove.startsWith('blob:')) {
        URL.revokeObjectURL(urlToRemove);
      }
      setPreviewUrls(prev => prev.filter((_, index) => index !== indexToRemove));
      setSelectedFiles(prev => prev.filter((_, index) => index !== indexToRemove));
      setBase64Images(prev => prev.filter((_, index) => index !== indexToRemove));
      clearResults();
  }, [previewUrls]);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      handleFilesSelect(e.target.files);
      if(e.target) e.target.value = '';
  };

  const handleGenerateBaseImage = async () => {
    if (base64Images.length === 0) {
      setError("Please select at least one reference image first.");
      return;
    }
    clearResults();
    setIsLoading(true);
    setLoadingMessage('Creating Base Identity...');
    
    try {
      const image = await generateBaseImage(base64Images, age);
      setBaseImage(image);
      const newHistoryItem: HistoryItem = { id: crypto.randomUUID(), type: 'base', resultImage: image, sourceImages: base64Images, age, timestamp: Date.now() };
      setHistory(prev => [newHistoryItem, ...prev]);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred during setup.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
      setLoadingMessage('');
    }
  };
  
  const handleGenerateVariation = async () => {
      if (!baseImage) return;

      const newSlot: GenerationSlot = {
        id: crypto.randomUUID(),
        status: 'generating',
        prompt: 'Generating new variation...'
      };
      setGenerationSlots(prev => [...prev, newSlot]);

      try {
        const baseImageData = {
            data: baseImage.url.split(',')[1],
            mimeType: 'image/jpeg'
        };
        const image = await generateVariationImage([ ...base64Images, baseImageData ], age);
        setGenerationSlots(prev => prev.map(slot => slot.id === newSlot.id ? { ...slot, status: 'success', image } : slot));
        const newHistoryItem: HistoryItem = { id: crypto.randomUUID(), type: 'variation', resultImage: image, sourceImages: [ ...base64Images, baseImageData ], age, timestamp: Date.now() };
        setHistory(prev => [newHistoryItem, ...prev]);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
        setGenerationSlots(prev => prev.map(slot => slot.id === newSlot.id ? { ...slot, status: 'error', error: errorMessage } : slot));
      }
  };

  const handleRegenerateVariation = useCallback(async (id: string) => {
    if (!baseImage) return;

    setGenerationSlots(prevSlots => prevSlots.map(slot => 
        slot.id === id ? { ...slot, status: 'generating', image: undefined, error: undefined } : slot
    ));

    try {
        const baseImageData = {
            data: baseImage.url.split(',')[1],
            mimeType: 'image/jpeg'
        };
        const image = await generateVariationImage([ ...base64Images, baseImageData ], age);
        setGenerationSlots(prevSlots => prevSlots.map(slot => 
            slot.id === id ? { ...slot, status: 'success', image } : slot
        ));
        const newHistoryItem: HistoryItem = { id: crypto.randomUUID(), type: 'variation', resultImage: image, sourceImages: [ ...base64Images, baseImageData ], age, timestamp: Date.now() };
        setHistory(prev => [newHistoryItem, ...prev]);
    } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
        setGenerationSlots(prevSlots => prevSlots.map(slot => 
            slot.id === id ? { ...slot, status: 'error', error: errorMessage } : slot
        ));
    }
  }, [base64Images, age, baseImage]);
  
  const handleRemoveVariation = (id: string) => {
    setGenerationSlots(prev => prev.filter(slot => slot.id !== id));
  };
  
  const handleEdit = useCallback(async () => {
    if (base64Images.length === 0) {
      setError("Please select an image first.");
      return;
    }
    if (!editPrompt.trim()) {
      setError("Please enter an edit description.");
      return;
    }
    setIsLoading(true);
    setLoadingMessage('Applying Edit...');
    clearResults();
    try {
      const newImage = await editImage(base64Images, editPrompt);
      setEditedImage(newImage);
      const newHistoryItem: HistoryItem = { id: crypto.randomUUID(), type: 'edit', resultImage: newImage, sourceImages: base64Images, editPrompt, timestamp: Date.now() };
      setHistory(prev => [newHistoryItem, ...prev]);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred. Please check the console.');
    } finally {
      setIsLoading(false);
      setLoadingMessage('');
    }
  }, [base64Images, editPrompt]);
  
  const successfulImages = generationSlots.filter(s => s.status === 'success').map(s => s.image!);

  const handleDownloadPack = async () => {
    if (!baseImage && successfulImages.length === 0) return;
    
    setIsDownloading(true);
    setError(null);
    try {
      const zip = new JSZip();
      
      if (baseImage) {
        const base64Data = baseImage.url.split(',')[1];
        zip.file(`image_00_base.jpeg`, base64Data, { base64: true });
        zip.file(`image_00_base.txt`, baseImage.prompt);
      }

      for (let i = 0; i < successfulImages.length; i++) {
        const image = successfulImages[i];
        const base64Data = image.url.split(',')[1];
        const fileName = `image_${String(i + 1).padStart(2, '0')}`;
        zip.file(`${fileName}.jpeg`, base64Data, { base64: true });
        zip.file(`${fileName}.txt`, image.prompt);
      }
      
      const zipBlob = await zip.generateAsync({ type: 'blob' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(zipBlob);
      link.download = 'lora_training_pack.zip';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);
    } catch (err) {
      console.error("Failed to create ZIP file", err);
      setError(err instanceof Error ? err.message : 'Could not create ZIP file.');
    } finally {
      setIsDownloading(false);
    }
  };
  
  const handleDownloadEditedImage = () => {
    if (!editedImage) return;
    const link = document.createElement('a');
    link.href = editedImage.url;
    link.download = 'edited_image.jpeg';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // --- History Handlers ---
  const handleHistorySelect = useCallback((item: HistoryItem) => {
    setIsLoading(false);
    clearResults();

    const newSource = dataUrlToBase64(item.resultImage.url);
    setBase64Images([newSource]);
    setPreviewUrls([item.resultImage.url]);
    setSelectedFiles([]);

    if (item.type === 'edit') {
        setMode('edit');
        setEditPrompt(item.editPrompt || item.resultImage.prompt);
    } else {
        setMode('generate');
        setAge(item.age || 25);
        setEditPrompt('');
    }
    
    window.scrollTo(0, 0);
  }, []);

  const handleHistoryDelete = useCallback((id: string) => {
    setHistory(prev => prev.filter(item => item.id !== id));
  }, []);

  const handleHistoryClear = useCallback(() => {
    setHistory([]);
  }, []);
  
  const dropHandler = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files) {
      handleFilesSelect(e.dataTransfer.files);
    }
  };

  const dragOverHandler = (e: React.DragEvent<HTMLDivElement>) => { e.preventDefault(); e.stopPropagation(); };
  const dragEnterHandler = (e: React.DragEvent<HTMLDivElement>) => { e.preventDefault(); e.stopPropagation(); setIsDragging(true); };
  const dragLeaveHandler = (e: React.DragEvent<HTMLDivElement>) => { e.preventDefault(); e.stopPropagation(); setIsDragging(false); };
  
  const generationAction = baseImage ? handleGenerateVariation : handleGenerateBaseImage;
  const generationButtonText = baseImage ? 'Generate Next Variation' : 'Create Base Identity Image';
  const isGeneratingVariation = generationSlots.some(s => s.status === 'generating');

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-sans flex flex-col items-center p-4 sm:p-6 md:p-8">
      <div className="w-full max-w-7xl mx-auto">
        <Header />
        
        <main className="mt-8 grid grid-cols-1 md:grid-cols-3 md:gap-8 lg:gap-12">
          <div className="md:col-span-1 mb-8 md:mb-0">
             <div className="space-y-6 sticky top-8">
                <HistoryPanel 
                    history={history}
                    onSelect={handleHistorySelect}
                    onDelete={handleHistoryDelete}
                    onClear={handleHistoryClear}
                />
                <div>
                  <h2 className="text-2xl font-bold text-gray-200 mb-4">1. Upload Image(s)</h2>
                  {previewUrls.length > 0 && (
                     <div className="grid grid-cols-3 gap-2 mb-4">
                       {previewUrls.map((url, index) => (
                         <div key={url} className="relative group aspect-square rounded-lg shadow-lg overflow-hidden">
                           <img src={url} alt={`Preview ${index + 1}`} className="w-full h-full object-cover" />
                           <button 
                             onClick={() => handleRemoveImage(index)} 
                             className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-1.5 hover:bg-black/80 transition-opacity opacity-0 group-hover:opacity-100"
                             aria-label="Remove image"
                           >
                             <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                           </button>
                         </div>
                       ))}
                     </div>
                  )}
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    onDrop={dropHandler} onDragOver={dragOverHandler} onDragEnter={dragEnterHandler} onDragLeave={dragLeaveHandler}
                    className={`relative w-full rounded-xl border-2 border-dashed flex flex-col items-center justify-center text-center p-4 cursor-pointer transition-colors ${isDragging ? 'border-purple-500 bg-gray-800/50' : 'border-gray-600 hover:border-purple-400'} ${previewUrls.length > 0 ? 'h-24' : 'aspect-square'}`}
                  >
                    <input type="file" accept="image/*" ref={fileInputRef} onChange={onFileChange} className="hidden" multiple />
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-4-4V7a4 4 0 014-4h.586a1 1 0 01.707.293l2.414 2.414a1 1 0 00.707.293h3.172a1 1 0 00.707-.293l2.414-2.414A1 1 0 0116.414 3H17a4 4 0 014 4v5a4 4 0 01-4 4H7z" /></svg>
                    <p className="mt-2 text-sm text-gray-400">{previewUrls.length > 0 ? 'Add more images' : 'Drag & drop images or'} <span className="font-semibold text-purple-400">click to browse</span>.</p>
                  </div>
                </div>
                
                <div>
                  <h2 className="text-2xl font-bold text-gray-200 mb-4">2. Set Age</h2>
                  <div className="bg-gray-800 p-4 rounded-lg">
                    <div className="flex justify-between items-center text-gray-400 mb-2">
                        <label htmlFor="age" className="font-medium">Subject Age</label>
                        <span className="px-3 py-1 text-sm font-bold text-purple-200 bg-purple-900/50 rounded-md">{age}</span>
                    </div>
                    <input 
                      id="age"
                      type="range"
                      min="18"
                      max="80"
                      value={age}
                      onChange={(e) => setAge(Number(e.target.value))}
                      className="w-full"
                    />
                  </div>
                </div>

                <div className="flex rounded-lg bg-gray-800 p-1">
                    <button onClick={() => handleModeChange('generate')} className={`w-1/2 py-2.5 text-sm font-medium leading-5 text-center rounded-lg transition-colors ${mode === 'generate' ? 'bg-purple-600 text-white shadow' : 'text-gray-300 hover:bg-gray-700/50'}`}>LoRA Pack Generator</button>
                    <button onClick={() => handleModeChange('edit')} className={`w-1/2 py-2.5 text-sm font-medium leading-5 text-center rounded-lg transition-colors ${mode === 'edit' ? 'bg-purple-600 text-white shadow' : 'text-gray-300 hover:bg-gray-700/50'}`}>Image Editor</button>
                </div>

                {mode === 'generate' && (
                  <div className="animate-fade-in space-y-4">
                     <h2 className="text-2xl font-bold text-gray-200">{baseImage ? '3. Generate Variations' : '3. Create Identity'}</h2>
                     <div className="flex items-center space-x-2">
                        <Button onClick={generationAction} disabled={isLoading || isGeneratingVariation || base64Images.length === 0} isLoading={isLoading || isGeneratingVariation}>
                        {isLoading ? loadingMessage : generationButtonText}
                        </Button>
                        {baseImage && (
                            <button onClick={clearResults} className="p-3 bg-gray-700 rounded-md hover:bg-gray-600 transition-colors" title="Start Over">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                            </button>
                        )}
                     </div>

                     {(baseImage || successfulImages.length > 0) && (
                        <div className="border-t border-gray-700 pt-6">
                          <h2 className="text-2xl font-bold text-gray-200 mb-4">4. Download Pack</h2>
                          <Button onClick={handleDownloadPack} disabled={isDownloading} isLoading={isDownloading}>
                            {isDownloading ? 'Zipping...' : `Download Pack (${successfulImages.length + (baseImage ? 1 : 0)})`}
                          </Button>
                          <p className="text-sm text-gray-500 mt-2">Includes base image and all variations with prompts.</p>
                        </div>
                      )}
                  </div>
                )}

                {mode === 'edit' && (
                  <div className="animate-fade-in space-y-4">
                    <h2 className="text-2xl font-bold text-gray-200">3. Describe Your Edit</h2>
                    <textarea 
                      value={editPrompt}
                      onChange={(e) => setEditPrompt(e.target.value)}
                      placeholder="e.g., Add a retro filter, make it black and white, remove the person in the background..."
                      className="w-full bg-gray-800 border border-gray-600 rounded-lg p-3 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                      rows={3}
                    />
                     <Button onClick={handleEdit} disabled={isLoading || base64Images.length === 0} isLoading={isLoading}>
                       {isLoading ? loadingMessage : 'Apply Edit'}
                     </Button>
                      {editedImage && !isLoading && (
                        <div className="border-t border-gray-700 pt-6">
                          <h2 className="text-2xl font-bold text-gray-200 mb-4">4. Download Image</h2>
                          <Button onClick={handleDownloadEditedImage}>
                            Download Image
                          </Button>
                        </div>
                      )}
                  </div>
                )}
             </div>
          </div>
          
          <div className="md:col-span-2">
            {error && (
              <div className="mb-6 p-4 bg-red-900/50 border border-red-700 text-red-300 rounded-lg w-full text-center">
                <p className="font-bold">Action Failed</p>
                <p className="text-sm">{error}</p>
              </div>
            )}

            <div className="w-full">
              {mode === 'generate' && (
                <>
                  {!baseImage && !isLoading && (
                    <div className="flex items-center justify-center text-center text-gray-500 h-full min-h-[50vh] rounded-xl bg-gray-800/30">
                      <div>
                        <h2 className="text-2xl font-semibold">Your Training Pack Awaits</h2>
                        <p className="mt-2 max-w-xl mx-auto">First, create a high-quality "Base Identity" image to ensure consistency across your entire training pack.</p>
                      </div>
                    </div>
                  )}
                  {isLoading && !baseImage && (
                    <div className="animate-fade-in">
                      <p className="text-center text-gray-400 mb-4">{loadingMessage}</p>
                      <ImageSlot slot={{id:'base-loading', status: 'generating', prompt: ''}} onRegenerate={() => {}} onRemove={() => {}}/>
                    </div>
                  )}
                  {baseImage && (
                    <div className="animate-fade-in space-y-8">
                       <div>
                          <h3 className="text-2xl font-bold text-purple-300 mb-4">Base Identity Image</h3>
                          <ImageSlot 
                            slot={{ id: baseImage.id, status: 'success', image: baseImage, prompt: baseImage.prompt }}
                            onRegenerate={() => handleGenerateBaseImage()} 
                            onRemove={() => {}}
                            isBaseImage={true}
                          />
                       </div>
                       {generationSlots.length > 0 && (
                          <div>
                            <h3 className="text-2xl font-bold text-purple-300 mb-4">Training Variations</h3>
                            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
                                {generationSlots.map((slot) => (
                                <ImageSlot key={slot.id} slot={slot} onRegenerate={() => handleRegenerateVariation(slot.id)} onRemove={() => handleRemoveVariation(slot.id)} />
                                ))}
                            </div>
                          </div>
                       )}
                    </div>
                  )}
                </>
              )}

              {mode === 'edit' && (
                 <>
                  {isLoading && <ImageSlot slot={{id:'edit-loading', status: 'generating', prompt: ''}} onRegenerate={() => {}} onRemove={()=>{}} />}
                  {!isLoading && editedImage === null && (
                     <div className="flex items-center justify-center text-center text-gray-500 h-full min-h-[50vh] rounded-xl bg-gray-800/30">
                      <div>
                        <h2 className="text-xl font-semibold">Image Editor</h2>
                        <p className="mt-2 max-w-xl mx-auto">Upload an image and describe your desired edit to see the magic happen.</p>
                      </div>
                    </div>
                  )}
                  {!isLoading && editedImage && (
                    <div className="animate-fade-in">
                      <ImageSlot 
                        slot={{
                          id: editedImage.id,
                          status: 'success',
                          image: editedImage,
                          prompt: editedImage.prompt
                        }}
                        onRegenerate={() => {}}
                        onRemove={() => {}}
                      />
                    </div>
                  )}
                 </>
              )}
            </div>
          </div>
        </main>

        <footer className="text-center text-gray-600 mt-16 pb-4">
          <p>Powered by Google Gemini. For creative and training purposes.</p>
        </footer>
      </div>
       <style>{`
          @keyframes fade-in {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-fade-in {
            animation: fade-in 0.5s ease-out forwards;
          }
          /* Custom Range Slider */
          input[type="range"] {
            -webkit-appearance: none;
            appearance: none;
            width: 100%;
            height: 8px;
            background: #2d3748; /* gray-800 */
            border-radius: 9999px;
            outline: none;
            transition: background 0.3s;
          }
          input[type="range"]:hover {
            background: #4a5568; /* gray-700 */
          }
          input[type="range"]::-webkit-slider-thumb {
            -webkit-appearance: none;
            appearance: none;
            width: 20px;
            height: 20px;
            background: #9f7aea; /* purple-500 */
            cursor: pointer;
            border-radius: 50%;
            border: 2px solid #edf2f7; /* gray-200 */
            box-shadow: 0 0 5px rgba(159, 122, 234, 0.5);
          }
          input[type="range"]::-moz-range-thumb {
            width: 20px;
            height: 20px;
            background: #9f7aea; /* purple-500 */
            cursor: pointer;
            border-radius: 50%;
            border: 2px solid #edf2f7; /* gray-200 */
            box-shadow: 0 0 5px rgba(159, 122, 234, 0.5);
          }
        `}</style>
    </div>
  );
};

export default App;
