import { Box, Link } from '@chakra-ui/react';

const Footer = () => {
  return (
    <Box align="center" opacity={0.4} fontSize="sm">
      &copy; {new Date().getFullYear()} Aaron Auld. All Rights Reserved. Credit to{' '}
      <Link href="https://www.craftz.dog/">Takuya Matsuyama</Link>
    </Box>
  );
};

export default Footer;