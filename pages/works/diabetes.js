import {
  Container,
  Badge,
  Link,
  List,
  Image,
  ListItem,
  SimpleGrid,
  Center
} from '@chakra-ui/react'
import Layout from '../../components/layouts/article'
import { ExternalLinkIcon } from '@chakra-ui/icons'
import { Title, WorkImage, Meta } from '../../components/work'
import P from '../../components/paragraph'

const Work = () => (
  <Layout title="Diabetes Classification">
    <Container>
      <Center my={6}>
        <Image src="/images/works/results.png" alt="icon" />
      </Center>
      <Title>
        Diabetes Classification <Badge>2019</Badge>
      </Title>
      <P>Classifying the presence of diabetes from scratch using analytics.</P>
      <br/>
      <div>
        Implemented K-Nearest Neighbours and Naive Bayes from scratch to predict presence of diabetes based on differing health measurements. Algorithms produced accuracy of ~75% for 5NN and Naive Bayes. Weka was utilised to conduct feature selection and compare our algorithms with those inbuilt into Weka. Such algorithms can be used in conjuction with domain-specific knowledge to provide preliminary understanding of patient's likelihood of having diabetes
      </div>

      <List ml={4} my={4}>
        <ListItem>
          <Meta>Platform</Meta>
          <span>Jupyter Notebook</span>
        </ListItem>
        <ListItem>
          <Meta>Stack</Meta>
          <span>Python</span>
        </ListItem>
        <ListItem>
          <Meta>Github</Meta>
          <Link href="https://github.com/aaronauld/pimaclassification">https://github.com/aaronauld/pimaclassification
          </Link>
        </ListItem>
      </List>
    </Container>
  </Layout>
)

export default Work
export { getServerSideProps } from '../../components/chakra'
