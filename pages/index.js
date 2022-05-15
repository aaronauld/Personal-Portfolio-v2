import NextLink from 'next/link'
import { Container, Button, Box, Heading, Image, Link, useColorModeValue } from '@chakra-ui/react'
import Section from '../components/section'
import Paragraph from '../components/paragraph'
import { ChevronRightIcon } from '@chakra-ui/icons'
import Layout from '../components/layouts/article'
import { BioSection, BioYear  } from '../components/bio'


const Page = () => {
    return (
        <Layout>
            <Container>
                <Box borderRadius="lg" bg={useColorModeValue('whiteAlpha.500', 'whiteAlpha.200')} p={3} mb={6} align="center">
                    Hello, I&apos;m a full-stack developer based in Japan!
                </Box>

                <Box display={{md:'flex'}}>
                    <Box flexGrow={1}>
                        <Heading as="h2" variant="page-title">
                            Aaron Auld
                        </Heading>
                        <p>Digital Craftzman ( Artist / Developer / Designer ) </p>
                    </Box>
                    <Box flexShrink={0} mt={{ base: 4, md: 0 }} ml={{ md: 6 }} align="center">
                        <Image borderColor="whiteAlpha.800" borderWidth={2} borderStyle="solid" maxWidth="100px" display="inline-block" borderRadius="full" src="images/takuya.jpg" alt="Profile Image" />
                    </Box>
                </Box>
                <Section delay={0.1}>
                    <Heading as="h3" variant="section-title">
                        Work
                    </Heading>
                    <Paragraph>I am doing work as a freelance, you can see my work{' '}
                        <NextLink href="/works/ink">
                            <Link>Inkdrop</Link>
                        </NextLink>
                        .
                    </Paragraph>
                    <Box align="center" my={4}>
                        <NextLink href="/works">
                            <Button rightIcon={<ChevronRightIcon /> } colorScheme="teal"> My Portfolio </ Button>
                        </NextLink>
                    </Box>
                </Section>
                
                <Section delay={0.2}>
                    <Heading as="h3" variant="section-title">
                        Bio
                    </Heading>
                    <BioSection>
                        <BioYear>2000</BioYear>
                        Born in Australia, 
                    </BioSection>
                    <BioSection>
                        <BioYear>2010</BioYear>
                        Completed Highschool
                    </BioSection>
                </Section>

                <Section delay={0.2}>
                    <Heading as="h3" variant="section-title">
                        I love
                    </Heading>
                    <Paragraph>
                        Art, Music, {' '}
                        <Link href="">Drawing</Link>
                        , Playing Drums, {' '}
                        <Link href="">Photography</Link>
                        , Leica, Machine Learning
                    </Paragraph>
                </Section>
            </Container>
        </Layout>
    )
}

export default Page