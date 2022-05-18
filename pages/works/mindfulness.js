import {
  Container,
  Badge,
  Link,
  List,
  ListItem,
  SimpleGrid,
  UnorderedList,
  Heading,
  Center,
  Image
} from '@chakra-ui/react'
import Layout from '../../components/layouts/article'
import { ExternalLinkIcon } from '@chakra-ui/icons'
import { Title, WorkImage, Meta } from '../../components/work'
import P from '../../components/paragraph'

const Work = () => (
  <Layout title="Mindfulness Tracker">
    <Container>
      <Title>
        Mindfullness Tracker <Badge>2020</Badge>
      </Title>
      <Center my={6}>
        <Image src="/images/works/mindfulness.png" alt="icon" />
      </Center>
      <P>
        Building a full stack meditation tracking project utilising the MERN stack. This was the first fullstack project I conducted and was created so that I could log my medtation sessions.
      </P>

      <List ml={4} my={4}>
        <ListItem>
          <Meta>Platform</Meta>
          <span>Local Dowwload and will run on any computer</span>
        </ListItem>
        <ListItem>
          <Meta>Stack</Meta>
          <span>MongoDB, Express, React JS, Node JS</span>
        </ListItem>
        <ListItem>
          <Meta>Github</Meta>
          <Link href="https://github.com/aaronauld/Meditation-Tracker">https://github.com/aaronauld/Meditation-Tracker
          </Link>
        </ListItem>
      </List>
    </Container>
  </Layout>
)

export default Work
export { getServerSideProps } from '../../components/chakra'
