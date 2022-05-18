import {
    Container,
    Badge,
    Link,
    List,
    ListItem,
    Center,
    Image
  } from '@chakra-ui/react'
  import Layout from '../../components/layouts/article'
  import { Title, Meta } from '../../components/work'
  import P from '../../components/paragraph'
  
  const Work = () => (
    <Layout title="Mindfulness Tracker">
      <Container>
        <Title>
          Personal Portfolio <Badge>2022</Badge>
        </Title>
        <Center my={6}>
          <Image src="/images/works/portfolio.png" alt="icon" />
        </Center>
        <P>
          Creating a new personal portfolio website, to display any personal and company related projects. The project was conducted using a guide and was specifically chosen to learn new languages. The project taught me how to use three.js and next.js to create awesome animated websites that are more captivating and aesthetic.
        </P>
  
        <List ml={4} my={4}>
          <ListItem>
            <Meta>Platform</Meta>
            <span>Any device with internet access</span>
          </ListItem>
          <ListItem>
            <Meta>Stack</Meta>
            <span>Next.js, Chakra UI, Framer Motion, Three.js</span>
          </ListItem>
          <ListItem>
            <Meta>Github</Meta>
            <Link href="https://github.com/aaronauld/portfolio">https://github.com/aaronauld/portfolio
            </Link>
          </ListItem>
          <ListItem>
            <Meta>Github</Meta>
            <Link href="https://github.com/aaronauld/portfolio">https://github.com/aaronauld/portfolio
            </Link>
          </ListItem>
        </List>
      </Container>
    </Layout>
  )
  
  export default Work
  export { getServerSideProps } from '../../components/chakra'
  