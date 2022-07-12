import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ButtonGroup,
  UnderlineLink,
  HelperCard,
  HelpersList,
  ImageStepButton,
  NoHelpers,
  ContactsList,
} from "./styles";

import Button from "../../components/button";
import Header from "../../components/header";
import ProfileIcon from "../../components/profileIcon";
import Shimmer from "../../components/shimmer";
import Modal from "../../components/modal";
import { CampaignsContext } from "../../providers/campaigns";
import { UserContext } from "../../providers/user";
import {
  Article,
  CampaignArrecadation,
  CampaignCard,
  CampaignContainer,
  CampaignHeader,
  CardBody,
  CardHeader,
  CardSidePanel,
  ContentMargin,
  CurrentArrecadation,
  FigureImage,
  GoalArrecadation,
  MainContainer,
  PricesArea,
  ProfileName,
  ProfileWithName,
  ProgressBar,
  TabButton,
  TabsList,
  Title,
} from "./styles";

import { ReactComponent as BadgeVolunteer } from "../../assets/imgs/BadgeVolunteer.svg";
import { ReactComponent as BadgeDonation } from "../../assets/imgs/BadgeDonation.svg";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

export default function Campaign() {
  const [selectedTab, setSelectedTab] = useState(0);
  const [thisCampaign, setThisCampaign] = useState({});
  const [campaignOwner, setCampaignOwner] = useState({});
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  const [imageStep, setImageStep] = useState(0);
  const [modalType, setModalType] = useState("donation");

  const { getCampaign } = useContext(CampaignsContext);
  const { getUserById, modal } = useContext(UserContext);
  const navigate = useNavigate();
  const params = useParams();

  useEffect(() => {
    if (!params.id) return navigate("/dashboard");

    getCampaign(params.id).then((data) => {
      console.log("Dados da campanha:", data);
      setThisCampaign(data);
    });
  }, []);

  useEffect(() => {
    thisCampaign?.ownerID &&
      getUserById(thisCampaign.ownerID).then((data) => {
        console.log("Dados do dono da campanha:", data);
        setCampaignOwner(data);
      });
  }, [thisCampaign]);

  useEffect(() => {
    window.addEventListener("resize", () => {
      setScreenWidth(window.innerWidth);
    });

    return () => {
      window.removeEventListener("resize", () => {});
    };
  }, []);

  function getRaisedAmount(raised = []) {
    return raised.reduce((prev, curr) => prev + curr.total, 0);
  }

  function nextImg() {
    console.log(imageStep);
    if (imageStep === thisCampaign.img.length - 1) {
      setImageStep(0);
    } else {
      setImageStep(imageStep + 1);
    }
  }

  function prevImg() {
    console.log(imageStep);

    if (imageStep === 0) {
      setImageStep(thisCampaign.img.length - 1);
    } else {
      setImageStep(imageStep - 1);
    }
  }

  const tabs = [
    {
      name: "Sobre",
      element: (
        <>
          {thisCampaign ? (
            <p>{thisCampaign?.description}</p>
          ) : (
            <Shimmer height={14} lines={4} />
          )}
        </>
      ),
    },
    {
      name: "Helpers",
      element: (
        <HelpersList>
          {thisCampaign?.helpers?.length > 0 ||
          thisCampaign?.raised?.length > 0 ? (
            [...thisCampaign?.helpers, ...thisCampaign?.raised].map(
              (helper) => (
                <HelperCard>
                  {helper.total ? <BadgeDonation /> : <BadgeVolunteer />}
                  <ProfileIcon size={40} name={helper.name} />
                  <p>
                    <span>{helper.name}</span>{" "}
                    {helper.total
                      ? "doou para esta campanha"
                      : "apoiou esta campanha"}
                  </p>
                </HelperCard>
              )
            )
          ) : (
            <NoHelpers>Seja um dos primeiros a apoiar esta campanha</NoHelpers>
          )}
        </HelpersList>
      ),
    },
    {
      name: "Contato",
      element: (
        <ContactsList>
          <p>
            E-mail:{" "}
            <UnderlineLink src={`mailto:${campaignOwner?.email}`}>
              {campaignOwner?.email}
            </UnderlineLink>
          </p>
          <p>
            Telefone:{" "}
            <UnderlineLink src={`tel:${campaignOwner?.contacts?.phone}`}>
              {campaignOwner?.contacts?.phone}
            </UnderlineLink>
          </p>
        </ContactsList>
      ),
    },
  ];

  return (
    <CampaignContainer>
      <Header fixed={screenWidth >= 1024} />
      {modalType === "donation" ? (
        <Modal closeable header={<h1>Contribua financeiramente</h1>}>
          <p>Nome da instituição: {campaignOwner?.name}</p>
          <p>Banco: {campaignOwner?.donation?.bank}</p>
          <p>Agência: {campaignOwner?.donation?.agency}</p>
          <p>Conta: {campaignOwner?.donation?.account}</p>
          <p>Chave Pix: {campaignOwner?.donation?.pix}</p>
        </Modal>
      ) : (
        <Modal closeable header={<h1>Contribua voluntáriamente</h1>}>
          <p>Data: {campaignOwner?.volunteer?.date}</p>
          <p>Endereço: {campaignOwner?.volunteer?.address}</p>
          <p>
            Em {campaignOwner?.volunteer?.city} -{" "}
            {campaignOwner?.volunteer?.state}
          </p>
          <Button>Adicionar ao calendário</Button>
        </Modal>
      )}
      <MainContainer>
        <Article>
          <CampaignHeader>
            <FigureImage>
              <ImageStepButton left onClick={prevImg}>
                <FiChevronLeft />
              </ImageStepButton>
              {thisCampaign?.img && (
                <img src={thisCampaign?.img[imageStep]} alt="Campanha" />
              )}
              <ImageStepButton right onClick={nextImg}>
                <FiChevronRight />
              </ImageStepButton>
            </FigureImage>
          </CampaignHeader>
          <ContentMargin>
            <CampaignCard>
              <CardHeader>
                {thisCampaign ? (
                  <Title>{thisCampaign.name}</Title>
                ) : (
                  <Shimmer height={30} lines={2} />
                )}

                <ProfileWithName>
                  <ProfileIcon size={36} name={campaignOwner?.name} />
                  <ProfileName>{campaignOwner?.name}</ProfileName>
                </ProfileWithName>

                {thisCampaign?.type?.financial && (
                  <CampaignArrecadation>
                    <PricesArea>
                      <CurrentArrecadation>
                        {getRaisedAmount(thisCampaign?.raised).toLocaleString(
                          "pt-BR",
                          {
                            style: "currency",
                            currency: "BRL",
                          }
                        )}
                      </CurrentArrecadation>
                      <GoalArrecadation>
                        de{" "}
                        {thisCampaign?.financialGoal?.toLocaleString("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        })}
                      </GoalArrecadation>
                    </PricesArea>
                    <ProgressBar
                      value={getRaisedAmount(thisCampaign?.raised)}
                      max={thisCampaign?.financialGoal}
                    />
                  </CampaignArrecadation>
                )}
                <TabsList>
                  <li>
                    <TabButton
                      $selected={selectedTab === 0}
                      onClick={() => setSelectedTab(0)}
                    >
                      {tabs[0].name}
                    </TabButton>
                  </li>
                  <li>
                    <TabButton
                      $selected={selectedTab === 1}
                      onClick={() => setSelectedTab(1)}
                    >
                      {tabs[1].name}
                    </TabButton>
                  </li>
                  <li>
                    <TabButton
                      $selected={selectedTab === 2}
                      onClick={() => setSelectedTab(2)}
                    >
                      {tabs[2].name}
                    </TabButton>
                  </li>
                </TabsList>
              </CardHeader>
              <CardBody>{tabs[selectedTab].element}</CardBody>
              {thisCampaign && (
                <CardSidePanel>
                  {thisCampaign?.type?.financial && (
                    <CampaignArrecadation sidePanel>
                      <PricesArea>
                        <CurrentArrecadation>
                          {getRaisedAmount(thisCampaign?.raised).toLocaleString(
                            "pt-BR",
                            {
                              style: "currency",
                              currency: "BRL",
                            }
                          )}
                        </CurrentArrecadation>
                      </PricesArea>
                      <ProgressBar
                        value={getRaisedAmount(thisCampaign?.raised)}
                        max={thisCampaign?.financialGoal}
                      />
                      <GoalArrecadation>
                        Objetivo:{" "}
                        {thisCampaign?.financialGoal?.toLocaleString("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        })}
                      </GoalArrecadation>
                    </CampaignArrecadation>
                  )}
                  <ButtonGroup>
                    {thisCampaign.type?.financial && (
                      <Button
                        onClick={() => {
                          setModalType("donation");
                          modal.open();
                        }}
                      >
                        Apoiar
                      </Button>
                    )}
                    {thisCampaign.type?.material && (
                      <Button
                        onClick={() => {
                          setModalType("volunteer");
                          modal.open();
                        }}
                      >
                        Voluntariar-se
                      </Button>
                    )}
                  </ButtonGroup>
                </CardSidePanel>
              )}
            </CampaignCard>
          </ContentMargin>
        </Article>
      </MainContainer>
    </CampaignContainer>
  );
}
