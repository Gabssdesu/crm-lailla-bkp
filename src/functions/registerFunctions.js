export const registerAcquisition = (acquisition, acquisitions, setAcquisitions, dadosCW, toast) => {
  if (
    !acquisition ||
    acquisitions.some(
      (item) => item?.toLowerCase().trim() === acquisition?.toLowerCase().trim()
    )
  )
    return;

  setAcquisitions((prev) => [...prev, acquisition]);

  fetch(process.env.NEXT_PUBLIC_WEBHOOK_SYSTEMDATA, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      option: "acquisition",
      value: acquisition,
      account_id: dadosCW.conversation.account_id,
    }),
  })
    .then(async (response) => {
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText);
      }
    })
    .catch((error) => {
      toast.current.show({
        severity: "error",
        summary: "Erro",
        detail: "Erro ao incluir captação: " + error.message,
        life: 2000,
      });
    });
};

export const registerCampaign = (campaign, campaigns, setCampaigns, dadosCW, toast) => {
  if (
    campaigns.some(
      (item) => item.toLowerCase().trim() === campaign.toLowerCase().trim()
    ) ||
    !campaign
  )
    return;

  setCampaigns((prev) => [...prev, campaign]);

  fetch(process.env.NEXT_PUBLIC_WEBHOOK_SYSTEMDATA, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      option: "campaign",
      value: campaign,
      account_id: dadosCW.conversation.account_id,
    }),
  })
    .then(async (response) => {
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText);
      }
    })
    .catch((error) => {
      toast.current.show({
        severity: "error",
        summary: "Erro",
        detail: "Erro ao incluir captação: " + error.message,
        life: 2000,
      });
    });
};

export const registerAd = (ad, ads, setAds, dadosCW, toast) => {
  if (
    ads.some(
      (item) => item.toLowerCase().trim() === ad.toLowerCase().trim()
    ) ||
    !ad
  )
    return;

  setAds((prev) => [...prev, ad]);

  fetch(process.env.NEXT_PUBLIC_WEBHOOK_SYSTEMDATA, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      option: "ad",
      value: ad,
      account_id: dadosCW.conversation.account_id,
    }),
  })
    .then(async (response) => {
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText);
      }
    })
    .catch((error) => {
      toast.current.show({
        severity: "error",
        summary: "Erro",
        detail: "Erro ao incluir captação: " + error.message,
        life: 2000,
      });
    });
};

export const registerIndication = (referral, referrals, setReferrals, dadosCW, toast) => {
  if (
    referrals.some(
      (item) => item.toLowerCase().trim() === referral.toLowerCase().trim()
    ) ||
    !referral
  )
    return;

  setReferrals((prev) => [...prev, referral]);

  fetch(process.env.NEXT_PUBLIC_WEBHOOK_SYSTEMDATA, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      option: "referral",
      value: referral,
      account_id: dadosCW.conversation.account_id,
    }),
  })
    .then(async (response) => {
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText);
      }
    })
    .catch((error) => {
      toast.current.show({
        severity: "error",
        summary: "Erro",
        detail: "Erro ao incluir captação: " + error.message,
        life: 2000,
      });
    });
};