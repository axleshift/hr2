import { CCard, CCardHeader, CCardBody, CCardFooter, CContainer, CRow, CCol, CWidgetStatsA } from "@coreui/react";
import { CChart } from "@coreui/react-chartjs";
import { useEffect, useState } from "react";

const applicationTrackingSystem = () => {
  const createRandomData = () => {
    const value = Math.floor(Math.random() * 100);
    const data = Array.from({ length: 7 }, () => Math.floor(Math.random() * 100));
    return { value, data };
  }
  const [stats, setStats] = useState({
    jobpostings: [
      { name: "Total Applications", value: 0, data: [0, 0, 0, 0, 0, 0, 0,], color: "primary", type: "line", pointRadius: 1 },
      { name: "Active Applicants", value: 0, data: [0, 0, 0, 0, 0, 0, 0,], color: "info", type: "bar", pointRadius: 0 },
      { name: "Total Job Postings", value: 0, data: [0, 0, 0, 0, 0, 0, 0,], color: "danger", type: "line", pointRadius: 1 },
      { name: "Active Job Postings", value: 0, data: [0, 0, 0, 0, 0, 0, 0,], color: "success", type: "line", pointRadius: 1 },
    ]
  });

  useEffect(() => {
    setStats((prevStats) => ({
      jobpostings: prevStats.jobpostings.map((posting) => {
        const randomData = createRandomData();
        return { ...posting, value: randomData.value, data: randomData.data };
      }),
    }));
  }, []);

  return (
    <CContainer className="d-flex flex-column gap-4 mb-3">
      <CRow>
        {
          stats.jobpostings.map((stat, index) => {
            return (
              <CCol key={index} sm={6} xl={4} xxl={3}>
                <CWidgetStatsA
                  className="mb-4"
                  color={stat.color}
                  value={
                    <>
                      <div className="fs-2 ">
                        {stat.value}
                      </div>
                    </>
                  }
                  title={stat.name}
                  chart={
                    <CChart
                      className="mt-3"
                      style={{ height: '70px' }}
                      type={stat.type}
                      data={{
                        labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
                        datasets: [
                          {
                            label: 'My First dataset',
                            backgroundColor: 'rgba(255,255,255,.2)',
                            borderColor: 'rgba(255,255,255,.55)',
                            data: stat.data,
                            fill: true,
                          },
                        ],
                      }}
                      options={{
                        plugins: {
                          legend: {
                            display: false,
                          },
                        },
                        maintainAspectRatio: false,
                        scales: {
                          x: {
                            display: false,
                          },
                          y: {
                            display: false,
                          },
                        },
                        elements: {
                          line: {
                            borderWidth: 2,
                            tension: 0.4,
                          },
                          point: {
                            radius: stat.pointRadius,
                            hitRadius: 10,
                            hoverRadius: 4,
                          },
                        },
                      }}
                    />
                  }
                />

              </CCol>
            );
          })
        }
      </CRow>
      <CRow>
        <CContainer>
          <CCard>
            <CCardHeader>
              In-progress Applications
            </CCardHeader>
            <CCardBody>
              List
            </CCardBody>
          </CCard>
        </CContainer>
      </CRow>
      <CRow>
        <CContainer>
          <CCard>
            <CCardHeader>
              Recent Job Postings
            </CCardHeader>
            <CCardBody>
              List
            </CCardBody>
          </CCard>
        </CContainer>
      </CRow>
      <CRow>
        <CContainer>
          <CCard>
            <CCardHeader>
              Recent Applicants
            </CCardHeader>
            <CCardBody>
              List
            </CCardBody>
          </CCard>
        </CContainer>
      </CRow>
    </CContainer>
  );
};

export default applicationTrackingSystem;