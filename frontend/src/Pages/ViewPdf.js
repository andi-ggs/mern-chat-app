import React, { useState, useEffect, useRef } from 'react';
import { Box, Heading, Button, Flex, Spinner, Text, Icon } from '@chakra-ui/react';
import { useParams, useHistory } from 'react-router-dom';
import axios from 'axios';
import { FaArrowLeft, FaDownload, FaExternalLinkAlt } from 'react-icons/fa';
import { useCallback } from 'react';

const ViewPdf = () => {
  const [exam, setExam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [pdfLoading, setPdfLoading] = useState(true);
  const { examId } = useParams();
  const history = useHistory();
  const canvasRef = useRef(null);
  const [numPages, setNumPages] = useState(0);
  const [pages, setPages] = useState([]);
  const [scale, setScale] = useState(1.5);
  const [currentPage, setCurrentPage] = useState(1);
  const pdfContainerRef = useRef();

  useEffect(() => {
    const fetchExam = async () => {
      try {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        if (!userInfo) {
          history.push('/');
          return;
        }

        const config = {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        };

        const { data } = await axios.get(`/api/exams/${examId}`, config);
        setExam(data);
        setLoading(false);
        //loadPDF(data.pdf);
      } catch (error) {
        console.error("Error fetching exam:", error);
        setError('Eroare la încărcarea examenului. Încercați din nou mai târziu.');
        setLoading(false);
      }
    };

    fetchExam();
  }, [examId, history]);

  const loadPDF = useCallback(async (pdfPath) => {
    try {
      setPdfLoading(true);
      const pdfjsLib = window.pdfjsLib;
      pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdn.jsdelivr.net/npm/pdfjs-dist@3.4.120/build/pdf.worker.min.js`;
  
      const url = `${window.location.origin}/${pdfPath}`;
      const loadingTask = pdfjsLib.getDocument(url);
      const pdfDocument = await loadingTask.promise;
      setNumPages(pdfDocument.numPages);
  
      const pagesArray = [];
  
      for (let pageNum = 1; pageNum <= pdfDocument.numPages; pageNum++) {
        const page = await pdfDocument.getPage(pageNum);
        const viewport = page.getViewport({ scale });
  
        const canvas = document.createElement('canvas');
        canvas.height = viewport.height;
        canvas.width = viewport.width;
        const context = canvas.getContext('2d');
  
        await page.render({ canvasContext: context, viewport }).promise;
  
        pagesArray.push(canvas.toDataURL()); // convert canvas to image
      }
  
      setPages(pagesArray);
    } catch (error) {
      console.error("Error loading PDF:", error);
      setError(`Eroare la încărcarea PDF-ului: ${error.message}`);
    } finally {
      setPdfLoading(false);
    }
  }, [scale]);

  const getFullPdfUrl = () => {
    if (!exam?.pdf) return '';
    // Remove any leading slash to avoid double slashes
    const pdfPath = exam.pdf.startsWith('/') ? exam.pdf.substring(1) : exam.pdf;
    return `${window.location.origin}/${pdfPath}`;
  };

  useEffect(() => {
    if (exam?.pdf) {
      loadPDF(exam.pdf);
    }
  }, [exam?.pdf, scale]);

  const handleDownload = () => {
    if (!exam) return;

    const link = document.createElement('a');
    link.href = getFullPdfUrl();
    link.setAttribute('download', `${exam.title}.pdf`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  const handleBack = () => {
    history.push('/view-exams');
  };

  const handleScroll = () => {
    const container = pdfContainerRef.current;
    const pageElements = container.querySelectorAll('img');
  
    for (let i = 0; i < pageElements.length; i++) {
      const el = pageElements[i];
      const rect = el.getBoundingClientRect();
      if (rect.top >= 0 && rect.bottom <= window.innerHeight) {
        setCurrentPage(i + 1);
        break;
      }
    }
  };

  if (loading) {
    return (
      <Flex justify="center" align="center" height="80vh">
        <Spinner size="xl" color="pink.500" />
      </Flex>
    );
  }

  if (error) {
    return (
      <Box maxW="800px" mx="auto" p={5} mt={5} textAlign="center">
        <Text color="red.500">{error}</Text>
        <Button mt={4} onClick={handleBack} leftIcon={<Icon as={FaArrowLeft} />}>
          Înapoi
        </Button>
      </Box>
    );
  }

  return (
    <Box width="1500px" mx="auto" p={5} mt={5}>
      <Box
        borderWidth="1px"
        borderRadius="lg"
        overflow="hidden"
        bg="white"
        h="80vh"
        w="100%"
        p={4}
      >
        <Flex justify="space-between" mb={4} gap={3}>
          <Flex gap={3}>
            <Button
              onClick={handleBack}
              leftIcon={<Icon as={FaArrowLeft} />}
              bg="rgb(122, 198, 210)"
              _hover={{ bg: "rgb(95, 174, 186)" }}
              color="white"
              boxShadow="lg"
              borderRadius="md"
              backdropFilter="blur(5px)">
              Înapoi
            </Button>
            <Button onClick={handleDownload} leftIcon={<Icon as={FaDownload} />} colorScheme="pink">
              Descarcă
            </Button>
          </Flex>

          <Heading size="lg" color="pink.500" textAlign="center" flex="1">
            {exam?.title}
          </Heading>

          {/* Optional spacer to balance the space visually */}
          <Box width="140px" />
        </Flex>
        {pdfLoading ? (
          <Flex justify="center" align="center" height="100%">
            <Spinner size="xl" color="pink.500" />
          </Flex>
        ) : (
          <Box 
            ref={pdfContainerRef}
            onScroll={handleScroll}
            overflow="auto"
            h="100%">
              <Flex justify="center" align="center" gap={4} mb={4}>
              <Button onClick={() => setScale(prev => Math.max(0.5, prev - 0.25))} colorScheme="blue">-</Button>
              <Text fontWeight="bold">Zoom: {(scale * 100).toFixed(0)}%</Text>
              <Button onClick={() => setScale(prev => Math.min(3, prev + 0.25))} colorScheme="blue">+</Button>
              <Text fontWeight="bold" ml={6}>Pagina: {currentPage} / {numPages}</Text>
            </Flex>
            {pages.map((imgSrc, index) => (
              <Box key={index} mb={6}>
                <img src={imgSrc} alt={`Page ${index + 1}`} style={{ borderRadius: '8px' }} />
              </Box>
            ))}
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default ViewPdf; 